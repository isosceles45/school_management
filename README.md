# School Management API

## Overview

This API allows you to manage school data, including adding new schools and retrieving a list of schools sorted by proximity to a specified location.

## API Endpoints

### 1. Add School

**Endpoint:** `/addSchool`  
**Method:** `POST`  
**Content-Type:** `application/json`  

#### Request

**Example Request:**
```json
{
  "name": "Green Valley High School",
  "address": "123 Maple Street, Springfield",
  "latitude": 40.7128,
  "longitude": -74.0060
}
```
Request Body Schema:

- name (string): Name of the school.
- address (string): Address of the school.
- latitude (number): Latitude of the school.
- longitude (number): Longitude of the school.

Responses
Success:

Status Code: 201 Created

Response Body:
``` json
{
  "message": "School added successfully!",
  "schoolId": 1
}
```
Error:

Status Code: 400 Bad Request

Response Body:
``` json
{
  "error": "All fields are required."
}
```
Status Code: 400 Bad Request

Response Body:
``` json

{
  "error": "Latitude and longitude must be numbers."
}
```

Status Code: 500 Internal Server Error

Response Body:
``` json
{
  "error": "Database error."
}
```
### 2. List Schools

**Endpoint:** `/listSchool`  
**Method:** `GET`  
**Content-Type:** `application/json`

Query Parameters
latitude (number): Latitude of the user's location.
longitude (number): Longitude of the user's location.

- GET ?latitude=40.7128&longitude=-74.0060 HTTP/1.1
- Host: https://school-management-5zf2.onrender.com/api/schools
- Content-Type: application/json

Responses
Success:

Status Code: 200 OK
Response Body:
``` json
[
  {
    "id": 1,
    "name": "Green Valley High School",
    "address": "123 Maple Street, Springfield",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "distance": 0
  },
  {
    "id": 2,
    "name": "Blue Ridge Academy",
    "address": "456 Oak Avenue, Springfield",
    "latitude": 40.7308,
    "longitude": -73.9973,
    "distance": 2.3
  }
]
```
