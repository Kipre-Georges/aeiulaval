# AEIULaval Website

## Overview
AEIULaval is the official website project for the Association of Ivorian Students at Université Laval.
The platform is designed so student office members can update content without writing code.

## Tech Stack
- **Next.js** for performance and modern web features
- **Decap CMS** for content management
- **Netlify** for deployment and hosting
- **GitHub** for version control and collaboration

## Key Features
- Editable homepage content
- Events management
- Resource guides for new students
- Blog publishing
- Photo gallery
- Admin dashboard at `/admin/`

## Project Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/Kipre-Georges/aeiulaval.git
   cd aeiulaval
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```
4. Open in browser:
   ```
   http://localhost:3000
   ```

## CMS Local Testing
To test content editing locally:
```bash
# Terminal 1
npm run dev

# Terminal 2
npm run cms
```
Then open:
```
http://localhost:3000/admin/
```

## Deployment (Netlify)
1. Connect repository on Netlify
2. Build command: `npm run build`
3. Publish directory: `out`
4. Enable **Identity** and **Git Gateway**
5. Invite content editors through Netlify Identity

## Content Structure
```text
content/
├── settings/
├── bureau/
├── events/
├── resources/
├── blog/
└── gallery/
```

## Contributing
Contributions are welcome through issues and pull requests.

## License
No license has been specified yet. Consider adding a LICENSE file.
