export const safeHtml = (html: string, strict?: boolean): string => {
    // del script tag
    const value = html.replace(/<script[^>]*?>[\s\S]*?<\/script>/g, '')
    // if strict mode, del all html tag
    if (strict) {
        return value.replace(/<[^>]+>/g, '')
    }
    return html
}


// time description
export const dateDescription = (time: number): string => {
    if (typeof time === 'string') {
        time = new Date(time).getTime()
    }

    const now = Date.now()
    const diff = (now - time) / 1000 // unit: second

    if (diff < 0) {
        const date = new Date(time)
        return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
    }
    if (diff < 60) {
        return `${Math.floor(diff)}秒前`
    } else if (diff < 3600) {
        return `${Math.floor(diff / 60)}分钟前`
    } else if (diff < 86400) {
        return `${Math.floor(diff / 3600)}小时前`
    } else if (diff < 1296000) {
        return `${Math.floor(diff / 86400)}天前`
    } else if (diff < 23328000) {
        const date = new Date(time)
        return `${date.getMonth() + 1}月${date.getDate()}日`
    } else {
        const date = new Date(time)
        return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
    }
}

type Color = {
    r: number;
    g: number;
    b: number;
};

export const randomColor = (): Color => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return { r, g, b };
}

export const colorToHex = (color: Color): string => {
    return `#${color.r.toString(16).padStart(2, '0')}${color.g.toString(16).padStart(2, '0')}${color.b.toString(16).padStart(2, '0')}`;
}

export const hexToColor = (hex: string): Color => {
    if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex)) {
        throw new Error('Invalid hex color');
    }
    const rgb = hex.slice(1).match(/.{1,2}/g) || [];
    return {
        r: parseInt(rgb[0]!, 16),
        g: parseInt(rgb[1]!, 16),
        b: parseInt(rgb[2]!, 16),
    };
}

export const getMatchingTextColor = (color: Color | string): string => {
    const inputColor = typeof color === 'string' ? hexToColor(color) : color;
    const { r, g, b } = inputColor;

    // 使用亮度公式计算颜色亮度
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    // 根据亮度选择匹配的文本颜色（黑色或白色）
    return brightness > 128 ? '#000000' : '#ffffff';
}

// 计算二进制大小
export const binarySize = (size: number): string => {
    if (size < 1024) {
        return `${size}B`
    }
    if (size < 1048576) {
        return `${(size / 1024).toFixed(2)}KB`
    }
    if (size < 1073741824) {
        return `${(size / 1048576).toFixed(2)}MB`
    }
    return `${(size / 1073741824).toFixed(2)}GB`
}

// 描述时间粒度
export const timeDescription = (time: number): string => {
    if (time < 60000) {
        return `${time}秒`
    }
    if (time < 3600000) {
        return `${Math.floor(time / 60000)}分`
    }
    if (time < 86400000) {
        return `${Math.floor(time / 3600000)}时${Math.floor(time % 3600000 / 60000)}分`
    }
    return `${Math.floor(time / 86400000)}天${Math.floor(time % 86400000 / 3600000)}时${Math.floor(time % 3600000 / 60000)}分`
}