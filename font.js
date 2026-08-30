const fonts = [
        '"Playfair Display", sans-serif',
        '"Onest", sans-serif',
        '"Combo", cursive',
        '"Outfit", sans-serif',
        '"DM Sans", sans-serif'
    ];

    const randomFont = fonts[Math.floor(Math.random() * fonts.length)];

    document.body.style.fontFamily = randomFont;