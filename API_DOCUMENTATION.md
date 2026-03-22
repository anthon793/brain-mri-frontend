# 🧠 NeuroScan AI — Backend API Documentation

> **Framework:** FastAPI (Python)  
> **Base URL:** `http://localhost:8000/api/v1`  
> **Auth:** JWT Bearer tokens  
> **Content-Type:** `application/json` (unless file upload)  
> **Date:** February 2026

---

## Table of Contents

1. [Conventions](#1-conventions)
2. [Authentication](#2-authentication)
3. [Dashboard](#3-dashboard)
4. [MRI Scans](#4-mri-scans)
5. [Training](#5-training)
6. [Datasets](#6-datasets)
7. [Models & Evaluation](#7-models--evaluation)
8. [Reports](#8-reports)
9. [Users](#9-users)
10. [Patients](#10-patients)
11. [Notifications](#11-notifications)
12. [System Settings](#12-system-settings)
13. [Database Schema Overview](#13-database-schema-overview)
14. [FastAPI Project Structure](#14-fastapi-project-structure)
15. [Environment Variables](#15-environment-variables)

---

## 1. Conventions

### Standard Response Envelope

Every endpoint returns this shape:

```json
{
  "success": true,
  "message": "Optional human-readable message",
  "data": { }
}
```

On error:

```json
{
  "success": false,
  "message": "Error description",
  "data": null
}
```

**Pydantic model:**

```python
from typing import TypeVar, Generic, Optional
from pydantic import BaseModel

T = TypeVar("T")

class ApiResponse(BaseModel, Generic[T]):
    success: bool
    message: Optional[str] = None
    data: T
```

### Paginated Responses

List endpoints return:

```json
{
  "success": true,
  "data": {
    "items": [ ... ],
    "total": 85,
    "page": 1,
    "page_size": 20,
    "total_pages": 5
  }
}
```

**Pydantic model:**

```python
class PaginatedResponse(BaseModel, Generic[T]):
    items: list[T]
    total: int
    page: int
    page_size: int
    total_pages: int
```

### Common Query Parameters for List Endpoints

| Param        | Type   | Default | Description                          |
|------------- |--------|---------|--------------------------------------|
| `page`       | int    | 1       | Page number (1-indexed)              |
| `page_size`  | int    | 20      | Items per page (max 100)             |
| `search`     | string | —       | Free-text search                     |
| `sort_by`    | string | —       | Field name to sort by                |
| `sort_order` | string | `asc`   | `asc` or `desc`                      |

### HTTP Status Codes Used

| Code | Meaning                              |
|------|--------------------------------------|
| 200  | Success                              |
| 201  | Created                              |
| 204  | Deleted (no content)                 |
| 400  | Bad request / Validation error       |
| 401  | Unauthorized (missing/invalid token) |
| 403  | Forbidden (insufficient role)        |
| 404  | Resource not found                   |
| 409  | Conflict (duplicate email, etc.)     |
| 422  | Unprocessable entity (FastAPI default for validation) |
| 500  | Internal server error                |

### Role-Based Access Control (RBAC)

Three roles exist:

| Role           | Access Level                                    |
|----------------|-------------------------------------------------|
| `super_admin`  | Full access to everything                       |
| `radiologist`  | Upload MRI, view scans, view reports            |
| `researcher`   | View metrics, view reports, view datasets       |

Use a FastAPI dependency to enforce:

```python
from fastapi import Depends, HTTPException, status

def require_roles(*allowed_roles: str):
    def checker(current_user = Depends(get_current_user)):
        if current_user.role not in allowed_roles:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return current_user
    return checker

# Usage:
@router.get("/users")
async def list_users(user = Depends(require_roles("super_admin"))):
    ...
```

---

## 2. Authentication

**Router prefix:** `/auth`

### POST `/auth/login`

Authenticate user with email & password. Returns JWT tokens.

- **Access:** Public
- **Request Body:**

```json
{
  "email": "admin@neuroscan.ai",
  "password": "admin123"
}
```

- **Response `201`:**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "dGhpcyBpcyBhIHJlZnJlc2g...",
    "expires_in": 3600,
    "user": {
      "id": "usr-001",
      "name": "Dr. Admin",
      "email": "admin@neuroscan.ai",
      "role": "super_admin",
      "avatar": "https://...",
      "department": "Radiology",
      "is_active": true,
      "last_login": "2026-02-26T10:30:00Z"
    }
  }
}
```

- **Error `401`:** Invalid credentials
- **Error `403`:** Account deactivated (`is_active = false`)

---

### POST `/auth/logout`

Invalidate the current refresh token server-side.

- **Access:** Authenticated
- **Headers:** `Authorization: Bearer <token>`
- **Response `200`:**

```json
{ "success": true, "message": "Logged out successfully", "data": null }
```

---

### GET `/auth/me`

Validate the current token and return the user profile.

- **Access:** Authenticated
- **Response `200`:**

```json
{
  "success": true,
  "data": {
    "id": "usr-001",
    "name": "Dr. Admin",
    "email": "admin@neuroscan.ai",
    "role": "super_admin",
    "avatar": "https://...",
    "department": "Radiology",
    "is_active": true,
    "last_login": "2026-02-26T10:30:00Z"
  }
}
```

---

### POST `/auth/refresh`

Exchange a refresh token for a new access token + refresh token pair.

- **Access:** Public (uses refresh token in body)
- **Request Body:**

```json
{
  "refresh_token": "dGhpcyBpcyBhIHJlZnJlc2g..."
}
```

- **Response `200`:**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "bmV3IHJlZnJlc2ggdG9rZW4...",
    "expires_in": 3600
  }
}
```

---

### POST `/auth/forgot-password`

Send a password-reset email with a time-limited token link.

- **Access:** Public
- **Request Body:**

```json
{ "email": "user@example.com" }
```

- **Response `200`:**

```json
{ "success": true, "message": "Reset link sent if email exists", "data": null }
```

---

### POST `/auth/reset-password`

Reset password using the emailed token.

- **Access:** Public
- **Request Body:**

```json
{
  "token": "reset-token-from-email",
  "new_password": "NewSecure123!",
  "confirm_password": "NewSecure123!"
}
```

- **Response `200`:**

```json
{ "success": true, "message": "Password reset successful", "data": null }
```

---

### POST `/auth/change-password`

Change password for the currently authenticated user.

- **Access:** Authenticated
- **Request Body:**

```json
{
  "current_password": "OldPass123",
  "new_password": "NewSecure456!",
  "confirm_password": "NewSecure456!"
}
```

- **Response `200`:**

```json
{ "success": true, "message": "Password changed successfully", "data": null }
```

---

## 3. Dashboard

**Router prefix:** `/dashboard`

### GET `/dashboard/stats`

Aggregate counts for the dashboard overview cards.

- **Access:** Authenticated (all roles)
- **Response `200`:**

```json
{
  "success": true,
  "data": {
    "total_scans": 1247,
    "tumors_detected": 342,
    "avg_confidence": 94.5,
    "active_models": 3,
    "pending_reviews": 12,
    "total_patients": 856
  }
}
```

---

### GET `/dashboard/weekly-activity`

Scan activity grouped by day for the bar chart.

- **Access:** Authenticated (all roles)
- **Query Params:**

| Param        | Type   | Description              |
|------------- |--------|--------------------------|
| `start_date` | string | ISO date (e.g. `2026-02-20`) |
| `end_date`   | string | ISO date (e.g. `2026-02-26`) |

- **Response `200`:**

```json
{
  "success": true,
  "data": [
    { "day": "Mon", "scans": 45, "detections": 12 },
    { "day": "Tue", "scans": 52, "detections": 18 },
    { "day": "Wed", "scans": 38, "detections": 8 },
    { "day": "Thu", "scans": 61, "detections": 22 },
    { "day": "Fri", "scans": 55, "detections": 15 },
    { "day": "Sat", "scans": 20, "detections": 5 },
    { "day": "Sun", "scans": 15, "detections": 3 }
  ]
}
```

---

### GET `/dashboard/tumor-distribution`

Tumor type percentage breakdown for the pie chart.

- **Access:** Authenticated (all roles)
- **Response `200`:**

```json
{
  "success": true,
  "data": [
    { "type": "Glioma", "percentage": 45.2, "count": 155, "color": "#3B82F6" },
    { "type": "Meningioma", "percentage": 28.1, "count": 96, "color": "#10B981" },
    { "type": "Pituitary", "percentage": 18.5, "count": 63, "color": "#F59E0B" },
    { "type": "Other", "percentage": 8.2, "count": 28, "color": "#8B5CF6" }
  ]
}
```

---

## 4. MRI Scans

**Router prefix:** `/scans`

### GET `/scans`

Paginated list of MRI scan records.

- **Access:** Authenticated (all roles)
- **Query Params:**

| Param            | Type    | Description                                |
|----------------- |---------|--------------------------------------------|
| `page`           | int     | Page number                                |
| `page_size`      | int     | Items per page                             |
| `search`         | string  | Search by patient name or scan ID          |
| `status`         | string  | `pending` / `processing` / `completed` / `failed` |
| `tumor_detected` | boolean | Filter by detection result                 |
| `patient_id`     | string  | Filter scans for a specific patient        |
| `start_date`     | string  | ISO date – filter from                     |
| `end_date`       | string  | ISO date – filter to                       |
| `sort_by`        | string  | `date`, `patient_name`, `status`           |
| `sort_order`     | string  | `asc` / `desc`                             |

- **Response `200`:**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "MRI-2026-001",
        "patient_id": "P-10482",
        "patient_name": "John Anderson",
        "date": "2026-02-26",
        "status": "completed",
        "tumor_detected": true,
        "confidence": 96.8,
        "tumor_type": "Glioma",
        "location": "Left Temporal Lobe",
        "uploaded_by": "Dr. Sarah Chen",
        "image_url": "/media/scans/MRI-2026-001.dcm",
        "annotated_image_url": "/media/scans/MRI-2026-001_annotated.png"
      }
    ],
    "total": 85,
    "page": 1,
    "page_size": 20,
    "total_pages": 5
  }
}
```

---

### GET `/scans/{scan_id}`

Get a single scan record.

- **Access:** Authenticated
- **Response `200`:** Single scan object (same shape as list item)
- **Error `404`:** Scan not found

---

### POST `/scans/upload`

Upload a new MRI image file.

- **Access:** `super_admin`, `radiologist`
- **Content-Type:** `multipart/form-data`
- **Form Fields:**

| Field        | Type   | Required | Description                    |
|------------- |--------|----------|--------------------------------|
| `file`       | File   | ✅       | MRI image (JPEG, PNG, DICOM)   |
| `patient_id` | string | ✅       | Patient this scan belongs to   |

- **Max File Size:** 50 MB
- **Response `201`:**

```json
{
  "success": true,
  "data": {
    "scan_id": "MRI-2026-009",
    "status": "pending",
    "uploaded_at": "2026-02-26T14:30:00Z"
  }
}
```

---

### POST `/scans/{scan_id}/detect`

Trigger YOLOv8 inference on an uploaded scan.

- **Access:** `super_admin`, `radiologist`
- **Request Body (optional):**

```json
{
  "model_id": "model-v2.4"
}
```

- **Response `200`:**

```json
{
  "success": true,
  "data": {
    "scan_id": "MRI-2026-009",
    "tumor_detected": true,
    "confidence": 94.2,
    "tumor_type": "Meningioma",
    "location": "Right Frontal Lobe",
    "bounding_box": {
      "x": 145,
      "y": 203,
      "width": 87,
      "height": 92
    },
    "processing_time": 2340,
    "model_version": "v2.4.1",
    "annotated_image_url": "/media/scans/MRI-2026-009_annotated.png"
  }
}
```

---

### GET `/scans/{scan_id}/result`

Fetch detection result for a previously processed scan.

- **Access:** Authenticated
- **Response `200`:** Same shape as detection result above
- **Error `404`:** No result available yet

---

### GET `/scans/{scan_id}/annotated`

Download the annotated image with bounding boxes.

- **Access:** Authenticated
- **Response:** Binary file (`image/png`)
- **Headers:** `Content-Disposition: attachment; filename="MRI-2026-009_annotated.png"`

---

### DELETE `/scans/{scan_id}`

Delete a scan record and its files from storage.

- **Access:** `super_admin`
- **Response `204`:** No content

---

## 5. Training

**Router prefix:** `/training`

### POST `/training/start`

Start a new model training job.

- **Access:** `super_admin`
- **Request Body:**

```json
{
  "epochs": 50,
  "batch_size": 16,
  "img_size": 640,
  "learning_rate": 0.001,
  "model": "yolov8n",
  "dataset_id": "ds-001"
}
```

- **Response `201`:**

```json
{
  "success": true,
  "data": {
    "id": "train-2026-005",
    "status": "queued",
    "config": { ... },
    "started_at": "2026-02-26T14:35:00Z",
    "current_epoch": 0,
    "total_epochs": 50,
    "progress": 0
  }
}
```

---

### POST `/training/{job_id}/stop`

Stop a running training job.

- **Access:** `super_admin`
- **Response `200`:** Updated training job object with `status: "stopped"`

---

### GET `/training/{job_id}`

Get current status and progress of a training job.

- **Access:** `super_admin`
- **Response `200`:** Training job object

---

### GET `/training/{job_id}/metrics`

Get epoch-by-epoch metrics for a training job.

- **Access:** `super_admin`
- **Response `200`:**

```json
{
  "success": true,
  "data": [
    {
      "epoch": 1,
      "precision": 0.42,
      "recall": 0.38,
      "mAP50": 0.35,
      "mAP50_95": 0.18,
      "f1": 0.40,
      "box_loss": 0.085,
      "cls_loss": 0.042,
      "dfl_loss": 0.031,
      "elapsed_time": 45.2
    }
  ]
}
```

---

### GET `/training/{job_id}/logs`

Get training log entries.

- **Access:** `super_admin`
- **Response `200`:**

```json
{
  "success": true,
  "data": [
    {
      "timestamp": "2026-02-26T14:35:12Z",
      "level": "info",
      "message": "Starting training with YOLOv8n on dataset ds-001"
    }
  ]
}
```

---

### GET `/training/{job_id}/stream`

**Server-Sent Events (SSE)** stream for real-time training updates.

- **Access:** `super_admin`
- **Content-Type:** `text/event-stream`
- **Events emitted:**

| Event    | Payload               | Description                    |
|----------|-----------------------|--------------------------------|
| `metric` | `TrainingEpochMetrics`| Fired after each epoch         |
| `log`    | `TrainingLogEntry`    | Real-time log line             |
| `status` | `TrainingJob`         | Status change (running → done) |
| `done`   | `null`                | Training finished              |

**FastAPI implementation:**

```python
from fastapi.responses import StreamingResponse
import asyncio, json

@router.get("/training/{job_id}/stream")
async def stream_training(job_id: str):
    async def event_generator():
        while True:
            metric = await get_latest_metric(job_id)
            if metric:
                yield f"event: metric\ndata: {json.dumps(metric)}\n\n"
            if is_complete(job_id):
                yield f"event: done\ndata: null\n\n"
                break
            await asyncio.sleep(1)
    return StreamingResponse(event_generator(), media_type="text/event-stream")
```

---

### GET `/training/history`

Paginated list of past training runs.

- **Access:** `super_admin`
- **Query Params:** Standard pagination + `status` filter
- **Response `200`:** Paginated list of training job objects

---

## 6. Datasets

**Router prefix:** `/datasets`

### GET `/datasets`

Paginated list of datasets.

- **Access:** `super_admin`, `researcher`
- **Query Params:**

| Param     | Type   | Description                     |
|-----------|--------|---------------------------------|
| `search`  | string | Filter by dataset name          |
| `format`  | string | `YOLO` / `COCO` / `VOC`        |
| `status`  | string | `ready` / `processing` / `error`|

Plus standard pagination params.

- **Response `200`:**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "ds-001",
        "name": "Brain Tumor Dataset v3",
        "size": "2.4 GB",
        "images": 5000,
        "annotations": 12500,
        "upload_date": "2026-01-15",
        "status": "ready",
        "format": "YOLO",
        "description": "Annotated brain MRI dataset",
        "classes": ["glioma", "meningioma", "pituitary", "no_tumor"]
      }
    ],
    "total": 5,
    "page": 1,
    "page_size": 20,
    "total_pages": 1
  }
}
```

---

### GET `/datasets/summary`

Aggregate counts for the dataset manager header.

- **Access:** `super_admin`, `researcher`
- **Response `200`:**

```json
{
  "success": true,
  "data": {
    "total_datasets": 5,
    "total_images": 18500,
    "total_annotations": 42000
  }
}
```

---

### GET `/datasets/{dataset_id}`

Get a single dataset's details.

- **Access:** `super_admin`, `researcher`
- **Response `200`:** Single dataset object

---

### POST `/datasets`

Upload a new dataset archive.

- **Access:** `super_admin`
- **Content-Type:** `multipart/form-data`
- **Form Fields:**

| Field         | Type   | Required | Description                        |
|---------------|--------|----------|------------------------------------|
| `name`        | string | ✅       | Dataset name                       |
| `format`      | string | ✅       | `YOLO` / `COCO` / `VOC`           |
| `description` | string | ❌       | Optional description               |
| `file`        | File   | ✅       | ZIP or TAR.GZ archive              |

- **Max File Size:** 10 GB
- **Response `201`:** Created dataset object with `status: "processing"`

---

### GET `/datasets/{dataset_id}/download`

Download a dataset archive.

- **Access:** `super_admin`, `researcher`
- **Response:** Binary file
- **Headers:** `Content-Disposition: attachment; filename="dataset.zip"`

---

### DELETE `/datasets/{dataset_id}`

Delete a dataset and its files.

- **Access:** `super_admin`
- **Response `204`:** No content

---

## 7. Models & Evaluation

**Router prefix:** `/models`

### GET `/models`

List available trained models.

- **Access:** `super_admin`, `researcher`
- **Response `200`:**

```json
{
  "success": true,
  "data": [
    {
      "id": "model-v2.4",
      "name": "NeuroScan YOLOv8n v2.4",
      "architecture": "YOLOv8n",
      "parameters": "3.2M",
      "flops": "8.7 GFLOPs",
      "input_size": "640×640",
      "classes": ["glioma", "meningioma", "pituitary", "no_tumor"],
      "dataset_name": "Brain Tumor Dataset v3",
      "epochs": 200,
      "batch_size": 16,
      "optimizer": "AdamW",
      "training_time": "4h 32m",
      "version": "2.4.1",
      "created_at": "2026-02-01T00:00:00Z"
    }
  ]
}
```

---

### GET `/models/{model_id}`

Get a single model's architecture details and training config.

- **Access:** `super_admin`, `researcher`
- **Response `200`:** Single model info object

---

### GET `/models/{model_id}/metrics`

Summary evaluation metrics for a model.

- **Access:** `super_admin`, `researcher`
- **Response `200`:**

```json
{
  "success": true,
  "data": {
    "precision": 0.926,
    "recall": 0.894,
    "mAP50": 0.912,
    "mAP50_95": 0.743,
    "f1": 0.910
  }
}
```

---

### GET `/models/{model_id}/pr-curve`

Precision-Recall curve data points for the area chart.

- **Access:** `super_admin`, `researcher`
- **Response `200`:**

```json
{
  "success": true,
  "data": [
    { "recall": 0.0, "precision": 1.0 },
    { "recall": 0.1, "precision": 0.98 },
    { "recall": 0.5, "precision": 0.94 },
    { "recall": 0.9, "precision": 0.85 },
    { "recall": 1.0, "precision": 0.72 }
  ]
}
```

---

### GET `/models/{model_id}/confusion-matrix`

Confusion matrix labels and percentage grid.

- **Access:** `super_admin`, `researcher`
- **Response `200`:**

```json
{
  "success": true,
  "data": {
    "labels": ["Glioma", "Meningioma", "Pituitary", "No Tumor"],
    "matrix": [
      [92.5, 3.2, 1.8, 2.5],
      [4.1, 89.3, 3.5, 3.1],
      [2.0, 2.8, 91.7, 3.5],
      [1.5, 1.2, 2.3, 95.0]
    ]
  }
}
```

---

### GET `/models/{model_id}/loss-history`

Per-epoch loss values for the loss graph.

- **Access:** `super_admin`, `researcher`
- **Response `200`:**

```json
{
  "success": true,
  "data": [
    { "epoch": 1, "box_loss": 0.085, "cls_loss": 0.042, "dfl_loss": 0.031 },
    { "epoch": 2, "box_loss": 0.078, "cls_loss": 0.039, "dfl_loss": 0.028 }
  ]
}
```

---

### GET `/models/{model_id}/weights`

Download trained model weights (.pt file).

- **Access:** `super_admin`
- **Response:** Binary file (`application/octet-stream`)
- **Headers:** `Content-Disposition: attachment; filename="neuroscan_v2.4.1.pt"`

---

### DELETE `/models/{model_id}`

Delete a model and its artifacts.

- **Access:** `super_admin`
- **Response `204`:** No content

---

## 8. Reports

**Router prefix:** `/reports`

### GET `/reports`

Paginated list of generated reports.

- **Access:** Authenticated (all roles)
- **Query Params:**

| Param  | Type   | Description                               |
|--------|--------|-------------------------------------------|
| `type` | string | `detection` / `training` / `evaluation`   |

Plus standard pagination params.

- **Response `200`:**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "rpt-001",
        "title": "MRI Detection Summary — Feb 2026",
        "type": "detection",
        "date": "2026-02-26",
        "generated_by": "Dr. Sarah Chen",
        "size": "2.4 MB",
        "download_url": "/api/v1/reports/rpt-001/download"
      }
    ],
    "total": 12,
    "page": 1,
    "page_size": 20,
    "total_pages": 1
  }
}
```

---

### POST `/reports/generate`

Generate a new report (PDF summary or CSV export).

- **Access:** `super_admin`, `radiologist`
- **Request Body:**

```json
{
  "type": "pdf",
  "title": "Monthly Detection Report",
  "scan_ids": ["MRI-2026-001", "MRI-2026-002"],
  "training_job_id": null,
  "date_range": {
    "start": "2026-02-01",
    "end": "2026-02-28"
  }
}
```

- **Response `201`:**

```json
{
  "success": true,
  "data": {
    "report_id": "rpt-015",
    "status": "generating",
    "estimated_time": 15
  }
}
```

---

### GET `/reports/{report_id}/status`

Poll generation status.

- **Access:** Authenticated
- **Response `200`:**

```json
{
  "success": true,
  "data": {
    "report_id": "rpt-015",
    "status": "ready",
    "download_url": "/api/v1/reports/rpt-015/download"
  }
}
```

---

### GET `/reports/{report_id}/download`

Download a generated report.

- **Access:** Authenticated
- **Response:** Binary file (`application/pdf` or `text/csv`)

---

### DELETE `/reports/{report_id}`

Delete a report.

- **Access:** `super_admin`
- **Response `204`:** No content

---

## 9. Users

**Router prefix:** `/users`

### GET `/users`

Paginated list of user accounts.

- **Access:** `super_admin`
- **Query Params:**

| Param       | Type    | Description                              |
|-------------|---------|------------------------------------------|
| `search`    | string  | Search by name or email                  |
| `role`      | string  | `super_admin` / `radiologist` / `researcher` |
| `is_active` | boolean | Filter active/inactive users             |

Plus standard pagination params.

- **Response `200`:**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "usr-001",
        "name": "Dr. Sarah Chen",
        "email": "admin@neuroscan.ai",
        "role": "super_admin",
        "avatar": "https://...",
        "department": "Radiology",
        "is_active": true,
        "last_login": "2026-02-26T10:30:00Z",
        "created_at": "2025-01-15T00:00:00Z"
      }
    ],
    "total": 5,
    "page": 1,
    "page_size": 20,
    "total_pages": 1
  }
}
```

---

### GET `/users/{user_id}`

Get a single user.

- **Access:** `super_admin`
- **Response `200`:** Single user object

---

### POST `/users`

Create a new user account.

- **Access:** `super_admin`
- **Request Body:**

```json
{
  "name": "Dr. New User",
  "email": "newuser@neuroscan.ai",
  "password": "TempPass123!",
  "role": "radiologist",
  "department": "Neurology"
}
```

- **Response `201`:** Created user object
- **Error `409`:** Email already exists

---

### PATCH `/users/{user_id}`

Update user fields.

- **Access:** `super_admin`
- **Request Body (all fields optional):**

```json
{
  "name": "Dr. Updated Name",
  "email": "updated@neuroscan.ai",
  "role": "researcher",
  "department": "Research"
}
```

- **Response `200`:** Updated user object

---

### PATCH `/users/{user_id}/toggle-active`

Toggle a user's active/inactive status.

- **Access:** `super_admin`
- **Response `200`:** Updated user object with flipped `is_active`

---

### DELETE `/users/{user_id}`

Remove a user account.

- **Access:** `super_admin`
- **Response `204`:** No content
- **Error `403`:** Cannot delete yourself

---

## 10. Patients

**Router prefix:** `/patients`

### GET `/patients`

Paginated list of patient records.

- **Access:** `super_admin`
- **Query Params:**

| Param    | Type   | Description                             |
|----------|--------|-----------------------------------------|
| `search` | string | Search by name, patient ID, or file no  |
| `status` | string | `active` / `discharged` / `referred`    |

Plus standard pagination params.

- **Response `200`:**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "P-10482",
        "file_no": "NRO-2026-0482",
        "first_name": "John",
        "last_name": "Anderson",
        "date_of_birth": "1978-03-14",
        "age": 47,
        "gender": "Male",
        "blood_type": "O+",
        "phone": "+1 (555) 234-8901",
        "email": "john.anderson@email.com",
        "address": "142 Maple Drive",
        "city": "Boston, MA 02108",
        "emergency_contact": {
          "name": "Sarah Anderson",
          "relation": "Spouse",
          "phone": "+1 (555) 234-8902"
        },
        "height": "5'11\"",
        "weight": "185 lbs",
        "bmi": 25.8,
        "allergies": ["Penicillin", "Latex"],
        "chronic_conditions": ["Hypertension"],
        "medications": ["Lisinopril 10mg", "Aspirin 81mg"],
        "primary_physician": "Dr. Sarah Chen",
        "registration_date": "2025-09-12",
        "last_visit": "2026-02-26",
        "status": "active",
        "insurance_provider": "Blue Cross Blue Shield",
        "insurance_id": "BCBS-449821",
        "mri_scans": 3,
        "diagnosis": "Glioma — Left Temporal Lobe",
        "notes": "Patient referred for follow-up MRI."
      }
    ],
    "total": 8,
    "page": 1,
    "page_size": 20,
    "total_pages": 1
  }
}
```

---

### GET `/patients/{patient_id}`

Full patient record with all biodata and medical history.

- **Access:** `super_admin`
- **Response `200`:** Single patient object (same shape as list item)

---

### POST `/patients`

Create a new patient record.

- **Access:** `super_admin`
- **Request Body:**

```json
{
  "first_name": "Jane",
  "last_name": "Doe",
  "date_of_birth": "1990-06-15",
  "gender": "Female",
  "blood_type": "A+",
  "phone": "+1 (555) 000-1234",
  "email": "jane.doe@email.com",
  "address": "123 Main Street",
  "city": "Boston, MA 02101",
  "emergency_contact": {
    "name": "John Doe",
    "relation": "Spouse",
    "phone": "+1 (555) 000-1235"
  },
  "height": "5'6\"",
  "weight": "135 lbs",
  "allergies": [],
  "chronic_conditions": [],
  "medications": [],
  "primary_physician": "Dr. Sarah Chen",
  "insurance_provider": "Aetna",
  "insurance_id": "AET-998877"
}
```

- **Response `201`:** Created patient object (with auto-generated `id`, `file_no`, `status: "active"`, etc.)

---

### PUT `/patients/{patient_id}`

Update a patient record.

- **Access:** `super_admin`
- **Request Body:** Any subset of patient fields + `status`, `diagnosis`
- **Response `200`:** Updated patient object

---

### DELETE `/patients/{patient_id}`

Delete a patient record.

- **Access:** `super_admin`
- **Response `204`:** No content

---

### GET `/patients/{patient_id}/scans`

List all MRI scans for a specific patient.

- **Access:** `super_admin`
- **Response `200`:**

```json
{
  "success": true,
  "data": [
    {
      "id": "MRI-2026-001",
      "patient_id": "P-10482",
      "date": "2026-02-26",
      "status": "completed",
      "tumor_detected": true,
      "confidence": 96.8,
      "tumor_type": "Glioma",
      "location": "Left Temporal Lobe"
    }
  ]
}
```

---

### GET `/patients/{patient_id}/notes`

List all clinical notes for a patient (newest first).

- **Access:** `super_admin`
- **Response `200`:**

```json
{
  "success": true,
  "data": [
    {
      "id": "note-001",
      "patient_id": "P-10482",
      "content": "Patient referred for follow-up MRI after initial detection.",
      "created_by": "Dr. Sarah Chen",
      "created_at": "2026-02-26T10:00:00Z"
    }
  ]
}
```

---

### POST `/patients/{patient_id}/notes`

Add a new clinical note.

- **Access:** `super_admin`
- **Request Body:**

```json
{
  "content": "Follow-up scan shows no tumor growth. Continue monitoring."
}
```

- **Response `201`:** Created note object

---

### GET `/patients/{patient_id}/export`

Export patient file as PDF or CSV.

- **Access:** `super_admin`
- **Query Params:**

| Param    | Type   | Default | Description          |
|----------|--------|---------|----------------------|
| `format` | string | `pdf`   | `pdf` or `csv`       |

- **Response:** Binary file with appropriate Content-Type

---

## 11. Notifications

**Router prefix:** `/notifications`

### GET `/notifications`

Paginated list of notifications for the current user.

- **Access:** Authenticated
- **Query Params:**

| Param         | Type    | Description                  |
|---------------|---------|------------------------------|
| `unread_only` | boolean | Only return unread items     |
| `page`        | int     | Page number                  |
| `page_size`   | int     | Items per page               |

- **Response `200`:**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "notif-001",
        "title": "Scan Completed",
        "message": "MRI scan MRI-2026-009 processing is complete.",
        "time": "2026-02-26T14:45:00Z",
        "read": false,
        "type": "success"
      }
    ],
    "total": 4,
    "page": 1,
    "page_size": 20,
    "total_pages": 1
  }
}
```

---

### GET `/notifications/unread-count`

Quick unread count for the navbar badge.

- **Access:** Authenticated
- **Response `200`:**

```json
{ "success": true, "data": { "count": 3 } }
```

---

### PATCH `/notifications/{notification_id}/read`

Mark a single notification as read.

- **Access:** Authenticated
- **Response `200`:**

```json
{ "success": true, "message": "Marked as read", "data": null }
```

---

### PATCH `/notifications/read-all`

Mark all notifications as read.

- **Access:** Authenticated
- **Response `200`:**

```json
{ "success": true, "message": "All marked as read", "data": null }
```

---

### DELETE `/notifications/{notification_id}`

Delete a notification.

- **Access:** Authenticated
- **Response `204`:** No content

---

## 12. System Settings

**Router prefix:** `/settings`

### GET `/settings`

Fetch all system settings.

- **Access:** `super_admin`
- **Response `200`:**

```json
{
  "success": true,
  "data": {
    "model": {
      "confidence_threshold": 0.25,
      "iou_threshold": 0.45,
      "max_detections": 100,
      "enable_gpu": true,
      "auto_retrain": false,
      "retrain_threshold": 500
    },
    "notifications": {
      "email_alerts": true,
      "scan_completion_notify": true,
      "training_completion_notify": true,
      "system_alerts": true
    },
    "security": {
      "session_timeout": 30,
      "mfa_enabled": false,
      "password_expiry": 90,
      "ip_whitelisting": false
    },
    "system": {
      "dark_mode": false,
      "auto_backup": true,
      "backup_frequency": "daily",
      "log_level": "info",
      "maintenance_mode": false
    }
  }
}
```

---

### PUT `/settings`

Save the entire settings object (full replacement).

- **Access:** `super_admin`
- **Request Body:** Same shape as GET response's `data`
- **Response `200`:**

```json
{ "success": true, "message": "Settings saved successfully", "data": { ... } }
```

---

### GET `/settings/system-info`

Get system version information.

- **Access:** `super_admin`
- **Response `200`:**

```json
{
  "success": true,
  "data": {
    "version": "2.4.1",
    "runtime_version": "YOLOv8 8.1.0",
    "last_updated": "2026-02-15",
    "uptime": "14d 6h 32m",
    "update_available": false,
    "latest_version": null
  }
}
```

---

### POST `/settings/check-updates`

Check for available system updates.

- **Access:** `super_admin`
- **Response `200`:**

```json
{
  "success": true,
  "data": {
    "update_available": true,
    "latest_version": "2.5.0",
    "release_notes": "https://..."
  }
}
```

---

## 13. Database Schema Overview

Suggested tables/models for the FastAPI backend (SQLAlchemy / Tortoise ORM):

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    users      │     │   patients   │     │    scans     │
├──────────────┤     ├──────────────┤     ├──────────────┤
│ id (PK)      │     │ id (PK)      │     │ id (PK)      │
│ name         │     │ file_no (UQ) │     │ patient_id → │
│ email (UQ)   │     │ first_name   │     │ date         │
│ password_hash│     │ last_name    │     │ status       │
│ role         │     │ dob          │     │ tumor_found  │
│ avatar       │     │ age          │     │ confidence   │
│ department   │     │ gender       │     │ tumor_type   │
│ is_active    │     │ blood_type   │     │ location     │
│ last_login   │     │ phone        │     │ uploaded_by →│
│ created_at   │     │ email        │     │ image_path   │
│ updated_at   │     │ address      │     │ annotated_img│
└──────────────┘     │ city         │     │ bbox_json    │
                     │ emergency_*  │     │ model_ver    │
┌──────────────┐     │ height       │     │ proc_time    │
│  datasets    │     │ weight       │     │ created_at   │
├──────────────┤     │ bmi          │     └──────────────┘
│ id (PK)      │     │ allergies[]  │
│ name         │     │ conditions[] │     ┌──────────────┐
│ size         │     │ medications[]│     │training_jobs │
│ images       │     │ physician    │     ├──────────────┤
│ annotations  │     │ reg_date     │     │ id (PK)      │
│ upload_date  │     │ last_visit   │     │ status       │
│ status       │     │ status       │     │ config_json  │
│ format       │     │ insurance_*  │     │ started_at   │
│ description  │     │ diagnosis    │     │ completed_at │
│ classes[]    │     │ created_at   │     │ cur_epoch    │
│ file_path    │     │ updated_at   │     │ total_epochs │
│ created_at   │     └──────────────┘     │ dataset_id → │
└──────────────┘                          │ created_at   │
                     ┌──────────────┐     └──────────────┘
┌──────────────┐     │clinical_notes│
│   reports    │     ├──────────────┤     ┌──────────────┐
├──────────────┤     │ id (PK)      │     │ train_metrics│
│ id (PK)      │     │ patient_id → │     ├──────────────┤
│ title        │     │ content      │     │ id (PK)      │
│ type         │     │ created_by → │     │ job_id →     │
│ date         │     │ created_at   │     │ epoch        │
│ generated_by │     └──────────────┘     │ precision    │
│ size         │                          │ recall       │
│ file_path    │     ┌──────────────┐     │ mAP50        │
│ created_at   │     │notifications │     │ mAP50_95     │
└──────────────┘     ├──────────────┤     │ f1           │
                     │ id (PK)      │     │ box_loss     │
┌──────────────┐     │ user_id →    │     │ cls_loss     │
│   models     │     │ title        │     │ dfl_loss     │
├──────────────┤     │ message      │     │ elapsed_time │
│ id (PK)      │     │ time         │     └──────────────┘
│ name         │     │ read         │
│ architecture │     │ type         │     ┌──────────────┐
│ parameters   │     │ created_at   │     │   settings   │
│ flops        │     └──────────────┘     ├──────────────┤
│ input_size   │                          │ id (PK)      │
│ classes[]    │                          │ key          │
│ dataset_id → │                          │ value (JSON) │
│ training_id→ │                          │ updated_at   │
│ weights_path │                          │ updated_by → │
│ version      │                          └──────────────┘
│ created_at   │
└──────────────┘
```

---

## 14. FastAPI Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                  # FastAPI app, CORS, lifespan
│   ├── config.py                # Settings from .env
│   ├── database.py              # SQLAlchemy engine & session
│   │
│   ├── models/                  # SQLAlchemy ORM models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── patient.py
│   │   ├── scan.py
│   │   ├── dataset.py
│   │   ├── training.py
│   │   ├── model.py
│   │   ├── report.py
│   │   ├── notification.py
│   │   └── setting.py
│   │
│   ├── schemas/                 # Pydantic request/response schemas
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── dashboard.py
│   │   ├── scan.py
│   │   ├── training.py
│   │   ├── dataset.py
│   │   ├── model.py
│   │   ├── report.py
│   │   ├── user.py
│   │   ├── patient.py
│   │   ├── notification.py
│   │   └── setting.py
│   │
│   ├── routers/                 # API route handlers
│   │   ├── __init__.py
│   │   ├── auth.py              # /api/v1/auth/*
│   │   ├── dashboard.py         # /api/v1/dashboard/*
│   │   ├── scans.py             # /api/v1/scans/*
│   │   ├── training.py          # /api/v1/training/*
│   │   ├── datasets.py          # /api/v1/datasets/*
│   │   ├── models.py            # /api/v1/models/*
│   │   ├── reports.py           # /api/v1/reports/*
│   │   ├── users.py             # /api/v1/users/*
│   │   ├── patients.py          # /api/v1/patients/*
│   │   ├── notifications.py     # /api/v1/notifications/*
│   │   └── settings.py          # /api/v1/settings/*
│   │
│   ├── services/                # Business logic
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   ├── scan_service.py
│   │   ├── training_service.py
│   │   ├── detection_service.py # YOLOv8 inference wrapper
│   │   ├── dataset_service.py
│   │   ├── report_service.py
│   │   └── patient_service.py
│   │
│   ├── core/                    # Cross-cutting concerns
│   │   ├── __init__.py
│   │   ├── security.py          # JWT encode/decode, password hashing
│   │   ├── dependencies.py      # get_current_user, require_roles
│   │   └── exceptions.py        # Custom HTTP exceptions
│   │
│   └── utils/
│       ├── __init__.py
│       ├── file_storage.py      # Save/serve uploaded files
│       └── pdf_generator.py     # Generate PDF reports
│
├── alembic/                     # Database migrations
│   ├── versions/
│   └── env.py
├── media/                       # Uploaded files (scans, datasets, models)
│   ├── scans/
│   ├── datasets/
│   ├── models/
│   └── reports/
├── alembic.ini
├── requirements.txt
├── .env
└── Dockerfile
```

---

## 15. Environment Variables

```env
# ─── App ──────────────────────────────────────────
APP_NAME=NeuroScan AI
APP_ENV=development
DEBUG=true

# ─── Server ───────────────────────────────────────
HOST=0.0.0.0
PORT=8000
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# ─── Database ─────────────────────────────────────
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/neuroscan

# ─── JWT ──────────────────────────────────────────
JWT_SECRET_KEY=your-super-secret-key-change-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
REFRESH_TOKEN_EXPIRE_DAYS=7

# ─── File Storage ─────────────────────────────────
MEDIA_DIR=./media
MAX_SCAN_SIZE_MB=50
MAX_DATASET_SIZE_GB=10

# ─── YOLOv8 ──────────────────────────────────────
YOLO_MODEL_PATH=./media/models/best.pt
YOLO_DEVICE=cuda:0
YOLO_CONFIDENCE_THRESHOLD=0.25
YOLO_IOU_THRESHOLD=0.45

# ─── Email (for password reset) ──────────────────
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@neuroscan.ai
SMTP_PASSWORD=your-email-password
```

---

## Endpoint Summary Table

| #  | Method   | Endpoint                                | Access            | Description                        |
|----|----------|-----------------------------------------|-------------------|------------------------------------|
| 1  | `POST`   | `/auth/login`                           | Public            | Login, get JWT tokens              |
| 2  | `POST`   | `/auth/logout`                          | Authenticated     | Invalidate session                 |
| 3  | `GET`    | `/auth/me`                              | Authenticated     | Get current user profile           |
| 4  | `POST`   | `/auth/refresh`                         | Public            | Refresh access token               |
| 5  | `POST`   | `/auth/forgot-password`                 | Public            | Request password reset email       |
| 6  | `POST`   | `/auth/reset-password`                  | Public            | Reset password with token          |
| 7  | `POST`   | `/auth/change-password`                 | Authenticated     | Change own password                |
| 8  | `GET`    | `/dashboard/stats`                      | Authenticated     | Dashboard aggregate counts         |
| 9  | `GET`    | `/dashboard/weekly-activity`            | Authenticated     | Weekly scan bar chart data         |
| 10 | `GET`    | `/dashboard/tumor-distribution`         | Authenticated     | Tumor type pie chart data          |
| 11 | `GET`    | `/scans`                                | Authenticated     | List scans (paginated)             |
| 12 | `GET`    | `/scans/{scan_id}`                      | Authenticated     | Get single scan                    |
| 13 | `POST`   | `/scans/upload`                         | Admin, Radiologist| Upload MRI file                    |
| 14 | `POST`   | `/scans/{scan_id}/detect`               | Admin, Radiologist| Run YOLOv8 detection               |
| 15 | `GET`    | `/scans/{scan_id}/result`               | Authenticated     | Get detection result               |
| 16 | `GET`    | `/scans/{scan_id}/annotated`            | Authenticated     | Download annotated image           |
| 17 | `DELETE` | `/scans/{scan_id}`                      | Admin             | Delete a scan                      |
| 18 | `POST`   | `/training/start`                       | Admin             | Start training job                 |
| 19 | `POST`   | `/training/{job_id}/stop`               | Admin             | Stop training job                  |
| 20 | `GET`    | `/training/{job_id}`                    | Admin             | Get training job status            |
| 21 | `GET`    | `/training/{job_id}/metrics`            | Admin             | Get epoch metrics                  |
| 22 | `GET`    | `/training/{job_id}/logs`               | Admin             | Get training logs                  |
| 23 | `GET`    | `/training/{job_id}/stream`             | Admin             | SSE stream for live updates        |
| 24 | `GET`    | `/training/history`                     | Admin             | List past training runs            |
| 25 | `GET`    | `/datasets`                             | Admin, Researcher | List datasets                      |
| 26 | `GET`    | `/datasets/summary`                     | Admin, Researcher | Dataset aggregate counts           |
| 27 | `GET`    | `/datasets/{dataset_id}`                | Admin, Researcher | Get single dataset                 |
| 28 | `POST`   | `/datasets`                             | Admin             | Upload new dataset                 |
| 29 | `GET`    | `/datasets/{dataset_id}/download`       | Admin, Researcher | Download dataset archive           |
| 30 | `DELETE` | `/datasets/{dataset_id}`                | Admin             | Delete dataset                     |
| 31 | `GET`    | `/models`                               | Admin, Researcher | List trained models                |
| 32 | `GET`    | `/models/{model_id}`                    | Admin, Researcher | Get model info                     |
| 33 | `GET`    | `/models/{model_id}/metrics`            | Admin, Researcher | Summary eval metrics               |
| 34 | `GET`    | `/models/{model_id}/pr-curve`           | Admin, Researcher | PR curve data points               |
| 35 | `GET`    | `/models/{model_id}/confusion-matrix`   | Admin, Researcher | Confusion matrix                   |
| 36 | `GET`    | `/models/{model_id}/loss-history`       | Admin, Researcher | Loss per epoch                     |
| 37 | `GET`    | `/models/{model_id}/weights`            | Admin             | Download model .pt file            |
| 38 | `DELETE` | `/models/{model_id}`                    | Admin             | Delete model                       |
| 39 | `GET`    | `/reports`                              | Authenticated     | List reports                       |
| 40 | `POST`   | `/reports/generate`                     | Admin, Radiologist| Generate PDF/CSV report            |
| 41 | `GET`    | `/reports/{report_id}/status`           | Authenticated     | Poll report generation status      |
| 42 | `GET`    | `/reports/{report_id}/download`         | Authenticated     | Download report file               |
| 43 | `DELETE` | `/reports/{report_id}`                  | Admin             | Delete report                      |
| 44 | `GET`    | `/users`                                | Admin             | List users                         |
| 45 | `GET`    | `/users/{user_id}`                      | Admin             | Get single user                    |
| 46 | `POST`   | `/users`                                | Admin             | Create user                        |
| 47 | `PATCH`  | `/users/{user_id}`                      | Admin             | Update user                        |
| 48 | `PATCH`  | `/users/{user_id}/toggle-active`        | Admin             | Toggle active status               |
| 49 | `DELETE` | `/users/{user_id}`                      | Admin             | Delete user                        |
| 50 | `GET`    | `/patients`                             | Admin             | List patients                      |
| 51 | `GET`    | `/patients/{patient_id}`                | Admin             | Get patient details                |
| 52 | `POST`   | `/patients`                             | Admin             | Create patient                     |
| 53 | `PUT`    | `/patients/{patient_id}`                | Admin             | Update patient                     |
| 54 | `DELETE` | `/patients/{patient_id}`                | Admin             | Delete patient                     |
| 55 | `GET`    | `/patients/{patient_id}/scans`          | Admin             | List patient's MRI scans           |
| 56 | `GET`    | `/patients/{patient_id}/notes`          | Admin             | List clinical notes                |
| 57 | `POST`   | `/patients/{patient_id}/notes`          | Admin             | Add clinical note                  |
| 58 | `GET`    | `/patients/{patient_id}/export`         | Admin             | Export patient file (PDF/CSV)      |
| 59 | `GET`    | `/notifications`                        | Authenticated     | List notifications                 |
| 60 | `GET`    | `/notifications/unread-count`           | Authenticated     | Get unread badge count             |
| 61 | `PATCH`  | `/notifications/{id}/read`              | Authenticated     | Mark notification as read          |
| 62 | `PATCH`  | `/notifications/read-all`               | Authenticated     | Mark all as read                   |
| 63 | `DELETE` | `/notifications/{id}`                   | Authenticated     | Delete notification                |
| 64 | `GET`    | `/settings`                             | Admin             | Get all system settings            |
| 65 | `PUT`    | `/settings`                             | Admin             | Save all system settings           |
| 66 | `GET`    | `/settings/system-info`                 | Admin             | Get system version info            |
| 67 | `POST`   | `/settings/check-updates`               | Admin             | Check for system updates           |

**Total: 67 endpoints**
