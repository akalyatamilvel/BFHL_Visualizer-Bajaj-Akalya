# BFHL Visualizer 

A full-stack app that processes node relationships (like `A->B`) and returns structured hierarchy insights.

## Tech Stack
- Backend: Node.js, Express  
- Frontend: HTML, CSS, JavaScript  
- Hosting: Render (API), Vercel (UI)

## Live Links
- Frontend: https://bfhl-visualizer-bajaj-akalya.vercel.app  
- Backend: https://bfhl-visualizer-backend.onrender.com/bfhl  
- Repo: https://github.com/akalyatamilvel/BFHL_Visualizer-Bajaj-Akalya  

## ⚙️ Features
- Validates input format  
- Removes duplicates  
- Detects cycles  
- Builds trees  
- Calculates depth  
- Returns summary
- 
## API
**POST /bfhl**

### Request
```json
{
  "data": ["A->B", "A->C", "B->D"]
}

