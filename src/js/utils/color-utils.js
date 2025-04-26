export function hexToRgb(hex) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

export function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}

export function interpolateColors(color1, color2, factor) {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    
    if (!rgb1 || !rgb2) return color1;
    
    const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * factor);
    const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * factor);
    const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * factor);
    
    return rgbToHex(r, g, b);
}

export function createGradient(ctx, x, y, radius, colors, stops) {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    
    colors.forEach((color, index) => {
        const stop = stops ? stops[index] : index / (colors.length - 1);
        gradient.addColorStop(stop, color);
    });
    
    return gradient;
}

export function pulseValue(baseValue, amplitude, frequency, time) {
    return baseValue + amplitude * Math.sin(time * frequency);
}

export function generateColorPalette(baseColor, variations = 5) {
    const base = hexToRgb(baseColor);
    if (!base) return [baseColor];
    
    const palette = [baseColor];
    const hslBase = rgbToHsl(base.r, base.g, base.b);
    
    // Generate lighter variations
    for (let i = 1; i <= variations; i++) {
        const lightness = Math.min(hslBase.l + (i * 0.1), 1);
        const rgb = hslToRgb(hslBase.h, hslBase.s, lightness);
        palette.push(rgbToHex(rgb.r, rgb.g, rgb.b));
    }
    
    // Generate darker variations
    for (let i = 1; i <= variations; i++) {
        const lightness = Math.max(hslBase.l - (i * 0.1), 0);
        const rgb = hslToRgb(hslBase.h, hslBase.s, lightness);
        palette.unshift(rgbToHex(rgb.r, rgb.g, rgb.b));
    }
    
    return palette;
}

function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        
        h /= 6;
    }
    
    return { h, s, l };
}

function hslToRgb(h, s, l) {
    let r, g, b;
    
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
} 