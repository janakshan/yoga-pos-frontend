 1. Create Branch

  curl -X 'POST' \
    'http://localhost:3000/api/v1/branches' \
    -H 'accept: */*' \
    -H 'Authorization: Bearer YOUR_TOKEN' \
    -H 'Content-Type: application/json' \
    -d '{
    "name": "Karaveddy",
    "code": "DT001",
    "address": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA",
    "phone": "+1234567890",
    "email": "downtown@example.com",
    "isActive": true,
    "settings": {
      "timezone": "America/New_York",
      "currency": "USD",
      "taxRate": 8.5,
      "operatingHours": {
        "monday": {"open": "09:00", "close": "18:00"},
        "tuesday": {"open": "09:00", "close": "18:00"},
        "wednesday": {"open": "09:00", "close": "18:00"},
        "thursday": {"open": "09:00", "close": "18:00"},
        "friday": {"open": "09:00", "close": "18:00"},
        "saturday": {"open": "10:00", "close": "16:00"},
        "sunday": {"open": "10:00", "close": "16:00"}
      }
    }
  }'

  2. Get All Branches (with filters)

  # Basic - Get all branches
  curl -X 'GET' \
    'http://localhost:3000/api/v1/branches' \
    -H 'accept: */*' \
    -H 'Authorization: Bearer YOUR_TOKEN'

  # With pagination
  curl -X 'GET' \
    'http://localhost:3000/api/v1/branches?page=1&limit=10' \
    -H 'accept: */*' \
    -H 'Authorization: Bearer YOUR_TOKEN'

  # With search
  curl -X 'GET' \
    'http://localhost:3000/api/v1/branches?search=downtown' \
    -H 'accept: */*' \
    -H 'Authorization: Bearer YOUR_TOKEN'

  # With filters
  curl -X 'GET' \
    'http://localhost:3000/api/v1/branches?city=New%20York&state=NY&isActive=true' \
    -H 'accept: */*' \
    -H 'Authorization: Bearer YOUR_TOKEN'

  # With sorting
  curl -X 'GET' \
    'http://localhost:3000/api/v1/branches?sortBy=name&sortOrder=ASC' \
    -H 'accept: */*' \
    -H 'Authorization: Bearer YOUR_TOKEN'

  # Combined filters
  curl -X 'GET' \

  'http://localhost:3000/api/v1/branches?page=1&limit=10&search=branch&city=New%20York&isActive=true&sortBy=name&sortOrder=DESC'
   \
    -H 'accept: */*' \
    -H 'Authorization: Bearer YOUR_TOKEN'

  3. Get Branch by ID

  curl -X 'GET' \
    'http://localhost:3000/api/v1/branches/BRANCH_ID' \
    -H 'accept: */*' \
    -H 'Authorization: Bearer YOUR_TOKEN'

  4. Get Branch by Code

  curl -X 'GET' \
    'http://localhost:3000/api/v1/branches/code/DT001' \
    -H 'accept: */*' \
    -H 'Authorization: Bearer YOUR_TOKEN'

  5. Get Overall Branch Statistics

  curl -X 'GET' \
    'http://localhost:3000/api/v1/branches/stats' \
    -H 'accept: */*' \
    -H 'Authorization: Bearer YOUR_TOKEN'

  6. Get Branch Settings

  curl -X 'GET' \
    'http://localhost:3000/api/v1/branches/BRANCH_ID/settings' \
    -H 'accept: */*' \
    -H 'Authorization: Bearer YOUR_TOKEN'

  7. Get Branch Operating Hours

  curl -X 'GET' \
    'http://localhost:3000/api/v1/branches/BRANCH_ID/operating-hours' \
    -H 'accept: */*' \
    -H 'Authorization: Bearer YOUR_TOKEN'

  8. Get Branch Performance Statistics

  curl -X 'GET' \
    'http://localhost:3000/api/v1/branches/BRANCH_ID/stats' \
    -H 'accept: */*' \
    -H 'Authorization: Bearer YOUR_TOKEN'

  9. Update Branch

  curl -X 'PATCH' \
    'http://localhost:3000/api/v1/branches/BRANCH_ID' \
    -H 'accept: */*' \
    -H 'Authorization: Bearer YOUR_TOKEN' \
    -H 'Content-Type: application/json' \
    -d '{
    "name": "Updated Branch Name",
    "phone": "+1987654321",
    "isActive": false
  }'

  10. Update Branch Settings

  curl -X 'PATCH' \
    'http://localhost:3000/api/v1/branches/BRANCH_ID/settings' \
    -H 'accept: */*' \
    -H 'Authorization: Bearer YOUR_TOKEN' \
    -H 'Content-Type: application/json' \
    -d '{
    "settings": {
      "timezone": "America/Los_Angeles",
      "currency": "USD",
      "taxRate": 9.5
    }
  }'

  11. Update Branch Operating Hours

  curl -X 'PATCH' \
    'http://localhost:3000/api/v1/branches/BRANCH_ID/operating-hours' \
    -H 'accept: */*' \
    -H 'Authorization: Bearer YOUR_TOKEN' \
    -H 'Content-Type: application/json' \
    -d '{
    "operatingHours": {
      "monday": {"open": "08:00", "close": "20:00"},
      "tuesday": {"open": "08:00", "close": "20:00"},
      "wednesday": {"open": "08:00", "close": "20:00"},
      "thursday": {"open": "08:00", "close": "20:00"},
      "friday": {"open": "08:00", "close": "20:00"},
      "saturday": {"open": "09:00", "close": "18:00"},
      "sunday": {"open": "10:00", "close": "17:00"}
    }
  }'

  12. Delete Branch

  curl -X 'DELETE' \
    'http://localhost:3000/api/v1/branches/BRANCH_ID' \
    -H 'accept: */*' \
    -H 'Authorization: Bearer YOUR_TOKEN'

  13. Assign Manager to Branch

  curl -X 'POST' \
    'http://localhost:3000/api/v1/branches/BRANCH_ID/manager' \
    -H 'accept: */*' \
    -H 'Authorization: Bearer YOUR_TOKEN' \
    -H 'Content-Type: application/json' \
    -d '{
    "managerId": "b2ac613c-32c1-435c-af92-48cbb31c6578"
  }'

  14. Bulk Update Branch Status

  curl -X 'POST' \
    'http://localhost:3000/api/v1/branches/bulk/status' \
    -H 'accept: */*' \
    -H 'Authorization: Bearer YOUR_TOKEN' \
    -H 'Content-Type: application/json' \
    -d '{
    "branchIds": [
      "BRANCH_ID_1",
      "BRANCH_ID_2",
      "BRANCH_ID_3"
    ],
    "isActive": false
  }'

  15. Get All Branches Performance

  curl -X 'GET' \
    'http://localhost:3000/api/v1/branches/performance' \
    -H 'accept: */*' \
    -H 'Authorization: Bearer YOUR_TOKEN'

  16. Compare Multiple Branches

  curl -X 'POST' \
    'http://localhost:3000/api/v1/branches/compare' \
    -H 'accept: */*' \
    -H 'Authorization: Bearer YOUR_TOKEN' \
    -H 'Content-Type: application/json' \
    -d '{
    "branchIds": [
      "BRANCH_ID_1",
      "BRANCH_ID_2"
    ]
  }'

  17. Clone Settings Between Branches

  curl -X 'POST' \
    'http://localhost:3000/api/v1/branches/settings/clone' \
    -H 'accept: */*' \
    -H 'Authorization: Bearer YOUR_TOKEN' \
    -H 'Content-Type: application/json' \
    -d '{
    "sourceBranchId": "SOURCE_BRANCH_ID",
    "targetBranchId": "TARGET_BRANCH_ID"
  }'