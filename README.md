# AI Lecture Buddy

Create a modern and responsive React web application called "AI Lecture Summarizer".

The application should have a clean, professional, and modern UI designed for university students. Use a white and blue color palette with smooth animations and rounded cards.

Pages:

1. Home Page

- Display the project title "AI Lecture Summarizer".

- Add a short description:

  "Upload your lecture audio or video and instantly receive a summary, key points, and revision questions using AI."

- Add a large "Upload Lecture" button.

- Add a hero illustration related to education and AI.

- Include supported formats: MP3, MP4, WAV.

2. Upload Page

- Drag and drop upload area.

- Allow users to upload audio or video files.

- Display the selected file name.

- Add language selection:

  - Arabic

  - English

- Add a "Generate Summary" button.

- Show file upload progress.

3. Processing Page

Display a loading screen with these steps:

✓ Uploading File

✓ Converting Speech to Text

✓ Generating Summary

✓ Creating Questions

Use animated progress indicators.

4. Results Page

Create four separate cards:

Card 1:

Summary

Card 2:

Key Points

Card 3:

Quiz Questions

Card 4:

Flashcards

Add buttons:

- Download PDF

- Download TXT

- Generate Again

5. History Page

Display previously processed lectures in a table:

- Lecture Name

- Date

- Status

- View Results button

UI Requirements:

- Use React.

- Use Tailwind CSS.

- Make the design fully responsive for mobile and desktop.

- Use modern shadows, glassmorphism effects, and smooth hover animations.

- Use Lucide React icons.

- Add dark mode support.

- Use reusable components.

- Keep the design minimal, elegant, and professional.

Generate only the frontend UI with mock data. Do not implement backend functionality yet.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://ai-lecture-buddy-71.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/324e9e69-0fdb-4ae6-8c0c-2967109b3197).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
