import os
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sqlalchemy import create_engine

# Create Flask App
app = Flask(__name__)
CORS(app)

# Define connection string using loaded environment variables
connection_string = f"postgresql://default:NpLQ8gFc1dsD@ep-aged-meadow-a1op3qk0-pooler.ap-southeast-1.aws.neon.tech/verceldb?sslmode=require"

# Create a SQLAlchemy engine
db_engine = create_engine(connection_string)

# tblroles define
sql_query_roles = "SELECT position, job_level, description, skills, degree_course FROM tblroles"

# fetch data from database to panda dataframe (suggested roles)
df_roles = pd.read_sql(sql_query_roles, con=db_engine)

# fill empty values with empty strings
df_roles = df_roles.fillna('')

# mix text column into one statement
df_roles['combined_text'] = df_roles['position'] + ' ' + df_roles['job_level'] + ' ' + df_roles['description'] + ' ' + df_roles['skills'] + ' ' + df_roles['degree_course']

# Create a TF-IDF vectorizer to convert text into numerical vectors for roles
tfidf_vectorizer_roles = TfidfVectorizer(stop_words='english')
tfidf_matrix_roles = tfidf_vectorizer_roles.fit_transform(df_roles['combined_text'])

# calculate tenure to years
def calculate_tenure(start_date, end_date):
    return (end_date - start_date).days / 365.25  # whole year

# Function to gather keywords from text
def get_keywords(text):
    return text.lower().split()

# Compute cosine similarity between job descriptions for user roles
cosine_sim_roles = cosine_similarity(tfidf_matrix_roles, tfidf_matrix_roles)

# Function to recommend top N similar jobs based on job title, level, description, skills, and degree/course
def recommend_jobs_with_priority(user_position, user_level, user_work_history, user_skills, user_degree_course, top_n=3):
    # Split user skills and degree course
    user_skill_keywords = get_keywords(user_skills)
    user_degree_keywords = get_keywords(user_degree_course)

    # Gather keywords from user work history
    work_history_keywords = []
    for index, row in user_work_history.iterrows():
        work_history_keywords.extend(get_keywords(row['skills']))

    # Combine keywords from all sources
    all_keywords = user_skill_keywords + user_degree_keywords + work_history_keywords

    # Filter jobs based on matching keywords
    matched_jobs = []
    for index, row in df_roles.iterrows():
        job_keywords = get_keywords(row['skills'])
        if any(keyword in job_keywords for keyword in all_keywords):
            matched_jobs.append(index)

    # Sort matched jobs by cosine similarity with user profile
    user_profile_vector = tfidf_vectorizer_roles.transform([user_skills])
    similarities = cosine_similarity(tfidf_matrix_roles[matched_jobs], user_profile_vector)
    matched_jobs_sorted = [matched_jobs[i] for i in np.argsort(similarities[:, 0])[::-1]]

    # Filter matched jobs based on user level
    matched_jobs_filtered = []
    for job_index in matched_jobs_sorted:
        job_level = df_roles.iloc[job_index]['job_level']
        if job_level == user_level:
            matched_jobs_filtered.append(job_index)

    # Calculate breakdown percentages
    total_weight = 0.4 + 0.3 + 0.2 + 0.1
    skill_weight = 0.4 / total_weight
    current_job_weight = 0.3 / total_weight
    previous_job_weight = 0.2 / total_weight
    education_weight = 0.1 / total_weight

    # Get top N matched jobs
    top_matched_jobs = matched_jobs_sorted[:top_n]

    # Calculate percentage breakdown for each job
    recommended_jobs = []
    for job in top_matched_jobs:
        skill_similarity = cosine_similarity(tfidf_matrix_roles[job], user_profile_vector)[0][0]
        current_job_similarity = sum(cosine_similarity(tfidf_matrix_roles[job], tfidf_vectorizer_roles.transform([text]))[0][0] for text in user_work_history['skills']) / len(user_work_history)
        previous_job_similarity = 0
        if len(user_work_history) > 1:
            previous_job_similarity = sum(cosine_similarity(tfidf_matrix_roles[job], tfidf_vectorizer_roles.transform([text]))[0][0] for text in user_work_history.iloc[:-1]['skills']) / (len(user_work_history) - 1)
        education_similarity = cosine_similarity(tfidf_matrix_roles[job], tfidf_vectorizer_roles.transform([user_degree_course]))[0][0]

        total_similarity = skill_weight * skill_similarity + current_job_weight * current_job_similarity + previous_job_weight * previous_job_similarity + education_weight * education_similarity

        recommended_jobs.append({
            "title": df_roles.iloc[job]['position'],
            "description": df_roles.iloc[job]['description'],
            "percentage": round(total_similarity * 100, 2)
        })

    # Normalize percentages to sum up to 100%
    total_percentage = sum(job['percentage'] for job in recommended_jobs)
    for job in recommended_jobs:
        job['percentage'] = round(job['percentage'] / total_percentage * 100, 2)

    return recommended_jobs


@app.route('/recommend', methods=['GET'])
def recommend_jobs():
    try:
        # Get user email from the request parameters
        user_email = request.args.get('email')
        
        # Fetch user profile based on email
        sql_query_profile = f"SELECT employee_id, job_position, job_level, skills FROM tblprofile WHERE email = '{user_email}'"
        df_profile = pd.read_sql(sql_query_profile, con=db_engine)

        # extract user job profile, job level, and employee ID
        user_employee_id = df_profile.at[0, 'employee_id']
        user_position = df_profile.at[0, 'job_position']
        user_level = df_profile.at[0, 'job_level']
        user_skills = df_profile.at[0, 'skills']

        # fetch data from database to panda dataframe (user work history)
        sql_query_work_history = f"SELECT job_title, start_date, end_date, skills FROM tblworkhistory WHERE employee_id = {user_employee_id}"
        df_work_history = pd.read_sql(sql_query_work_history, con=db_engine)

        # fetch data from database to panda dataframe (user education background)
        sql_query_education_background = f"SELECT degree_course FROM tbleducbackground WHERE employee_id = {user_employee_id}"
        df_education_background = pd.read_sql(sql_query_education_background, con=db_engine)
        
        # Call the function to get recommendations based on priority
        recommended_jobs = recommend_jobs_with_priority(user_position, user_level, df_work_history,
                                                        user_skills, df_education_background.at[0, 'degree_course'])

        # Convert recommendations to JSON and return
        return jsonify(recommended_jobs)

    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True)