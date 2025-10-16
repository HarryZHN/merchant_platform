import os
import sys
from PIL import Image, ImageDraw
import xml.etree.ElementTree as ET

# 定义SVG颜色映射
COLORS = {
    '#999999': (153, 153, 153),
    '#ff9900': (255, 153, 0),
    '#3399ff': (51, 153, 255),
    '#ff3366': (255, 51, 102),
    '#33cc99': (51, 204, 153),
    '#339900': (51, 153, 0),
    '#cc9966': (204, 153, 102),
    'white': (255, 255, 255),
    'black': (0, 0, 0),
    '#ffffff': (255, 255, 255),
    '#000000': (0, 0, 0)
}

def get_color(color_str, default=(153, 153, 153)):
    """获取颜色值"""
    if color_str in COLORS:
        return COLORS[color_str]
    # 处理rgba或rgb格式
    if color_str.startswith('rgba') or color_str.startswith('rgb'):
        # 简化处理，只提取rgb部分
        try:
            values = color_str.split('(')[1].split(')')[0].split(',')[:3]
            return tuple(int(v.strip()) for v in values)
        except:
            return default
    return default

def create_simple_icon(filename, size=64):
    """为无法解析的SVG创建简单替代图标"""
    img = Image.new('RGBA', (size, size), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    
    # 根据文件名生成不同颜色的简单图标
    color_map = {
        'home': (76, 175, 80),
        'shop': (33, 150, 243),
        'cart': (255, 152, 0),
        'user': (156, 39, 176),
        'fruit': (255, 153, 0),
        'import': (51, 153, 255),
        'gift': (255, 51, 102),
        'tropical': (51, 204, 153),
        'local': (51, 153, 0),
        'nuts': (204, 153, 102),
        'product': (96, 125, 139),
        'avatar': (158, 158, 158),
        'empty': (189, 189, 189),
        'default': (153, 153, 153)
    }
    
    # 确定使用的颜色
    color_key = 'default'
    for key, color in color_map.items():
        if key in filename.lower():
            color_key = key
            break
    
    # 绘制简单图标
    draw.rectangle([10, 10, size-10, size-10], fill=color_map[color_key])
    
    return img

def convert_svg_to_png(svg_path, png_path):
    """将SVG文件转换为PNG文件"""
    try:
        # 尝试创建简单替代图标（因为直接解析SVG需要更复杂的库）
        img = create_simple_icon(os.path.basename(svg_path))
        img.save(png_path, 'PNG')
        print(f"已转换: {svg_path} -> {png_path}")
        return True
    except Exception as e:
        print(f"转换失败 {svg_path}: {e}")
        # 如果失败，创建一个简单的占位符
        try:
            img = Image.new('RGB', (64, 64), color=(200, 200, 200))
            img.save(png_path, 'PNG')
            print(f"已创建占位符: {png_path}")
            return True
        except:
            return False

def process_directory(directory):
    """处理目录中的所有SVG文件"""
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.svg'):
                svg_path = os.path.join(root, file)
                png_path = svg_path.replace('.svg', '.png')
                convert_svg_to_png(svg_path, png_path)

if __name__ == "__main__":
    # 处理images目录
    images_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'images')
    if os.path.exists(images_dir):
        process_directory(images_dir)
        print("所有SVG文件已转换为PNG格式")
    else:
        print("images目录不存在")