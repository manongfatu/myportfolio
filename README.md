# Jurris Leuwe Tolosa — Portfolio

A modern, responsive portfolio website with Three.js animated background, lightbox gallery, dark/light mode, and contact form.

## 🚀 Deploy to Netlify

### Option 1: Drag & Drop (Fastest)
1. Go to [netlify.com](https://netlify.com) and sign in
2. Drag the entire `portfolio_site` folder onto the Netlify dashboard
3. Done! Your site will be live in seconds.

### Option 2: Git Deploy
1. Push this folder to a GitHub repository
2. Connect the repo in Netlify → "New site from Git"
3. Build command: *(leave empty)*
4. Publish directory: `.`
5. Click Deploy

## 📧 Setting Up Contact Form

The contact form uses a mailto fallback by default. To use a real backend form:

### Formspree (Free, Recommended)
1. Create a free account at [formspree.io](https://formspree.io)
2. Create a new form and copy your endpoint (e.g. `https://formspree.io/f/xabc1234`)
3. Open `index.html` and find the form tag:
   ```html
   <form class="contact-form" id="contact-form" novalidate>
   ```
4. Add your Formspree endpoint:
   ```html
   <form class="contact-form" id="contact-form" novalidate data-formspree="https://formspree.io/f/YOUR_ID">
   ```

### Netlify Forms (Built-in, Zero Config)
1. Add `netlify` attribute to the form tag:
   ```html
   <form class="contact-form" id="contact-form" name="contact" netlify novalidate>
   ```
2. Add a hidden input inside the form:
   ```html
   <input type="hidden" name="form-name" value="contact" />
   ```
3. Netlify will automatically handle form submissions.

## 📁 File Structure

```
portfolio_site/
├── index.html          # Main HTML
├── netlify.toml        # Netlify config
├── css/
│   └── style.css       # All styles
├── js/
│   ├── main.js         # Interactions, lightbox, theme, filters
│   └── bg.js           # Three.js animated background
└── images/
    ├── My face profile picture.png
    ├── Website Development/
    ├── Branding Design - Rampz (Web 3 Project)/
    ├── Logo Design - .../
    ├── Graphic Design - Ryori/
    ├── Webcast Production/
    ├── NFT Project - DeadHeadz NFT/
    ├── Email Marketing Design/
    └── Davao DeFi Community .../
```

## ✨ Features

- **Three.js animated wave background** — subtle, dynamic, not distracting
- **Dark/Light mode toggle** — persists in localStorage
- **Portfolio filter tabs** — filter by category (Web, Branding, Logo, etc.)
- **Lightbox** — click any portfolio image to view full size, navigate with arrows or keyboard
- **Animated counters** — stats animate when scrolled into view
- **Skill progress bars** — animate on scroll
- **Scroll-triggered fade animations** — elements fade up on scroll
- **Fully responsive** — desktop, tablet, and mobile
- **Contact form** — mailto fallback, or plug in Formspree/Netlify Forms
- **Active nav tracking** — highlights current section
- **Satoshi font** — loaded via Fontshare CDN

## 🎨 Customization

- **Colors**: Edit CSS variables in `css/style.css` under `:root` and `[data-theme="light"]`
- **Content**: All text, images, and links are in `index.html`
- **Background intensity**: Adjust `opacity` on `#bg-canvas` in `css/style.css`
