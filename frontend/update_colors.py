import os
import re

MAPPING = {
    r'bg-arctic-bg': 'bg-mystic-bg',
    r'bg-arctic-secondary': 'bg-mystic-bg',
    r'bg-arctic-card': 'bg-mystic-card',
    r'bg-arctic-card-subtle': 'bg-mystic-card-hover',
    r'text-navy-deep': 'text-mystic-text',
    r'text-navy-mid': 'text-mystic-text-muted',
    r'text-text-muted': 'text-mystic-text-muted',
    r'border-border-default': 'border-mystic-border',
    r'bg-electric-blue': 'bg-mystic-accent',
    r'text-electric-blue': 'text-mystic-accent',
    r'border-electric-blue': 'border-mystic-accent',
    r'ring-electric-blue': 'ring-mystic-accent',
    r'hover:bg-electric-blue/90': 'hover:bg-mystic-accent-hover text-mystic-dark',
    r'hover:bg-electric-blue/10': 'hover:bg-mystic-accent/10',
    r'focus:ring-electric-blue': 'focus:ring-mystic-accent',
    r'hover:bg-arctic-secondary': 'hover:bg-mystic-card-hover',
    r'hover:shadow-card-hover': 'hover:shadow-gold-glow',
    r'shadow-card-active': 'shadow-gold-glow',
    r'bg-navy-deep': 'bg-mystic-card',
    r'text-arctic-card': 'text-mystic-dark',
    r'text-white': 'text-mystic-text',
    # Handle the gradient text
    r'from-electric-blue to-neon-orange': 'from-mystic-accent to-mystic-accent-hover',
    r'from-electric-blue to-neon-orange-dark': 'from-mystic-accent to-mystic-accent-hover',
    r'bg-white': 'bg-mystic-card',
    r'bg-gray-50': 'bg-mystic-bg',
    r'text-gray-900': 'text-mystic-text',
    r'text-gray-600': 'text-mystic-text-muted',
    r'text-gray-500': 'text-mystic-text-muted',
    r'border-gray-200': 'border-mystic-border',
    r'border-gray-100': 'border-mystic-border',
}

def update_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    for old, new in MAPPING.items():
        new_content = re.sub(rf'\b{old}\b', new, new_content)
        
    # Also replace any string literals that might match
    if new_content != content:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {path}")

def main():
    src_dir = os.path.join('c:\\Users\\Ankit\\Desktop\\ClaimSense 2.0\\claimsense\\frontend\\src')
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith('.jsx') or file.endswith('.js') or file.endswith('.css'):
                update_file(os.path.join(root, file))

    # Also update index.html if needed
    update_file('c:\\Users\\Ankit\\Desktop\\ClaimSense 2.0\\claimsense\\frontend\\index.html')

if __name__ == '__main__':
    main()
