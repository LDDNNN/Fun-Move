"""Inline the single-file build's JS and CSS into one HTML page (dist-single/app.html)."""
import pathlib, re

out = pathlib.Path('dist-single')
html = (out / 'index.html').read_text(encoding='utf-8')

def inline_css(m):
    return '<style>' + (out / m.group(1).lstrip('/')).read_text(encoding='utf-8') + '</style>'

def inline_js(m):
    js = (out / m.group(1).lstrip('/')).read_text(encoding='utf-8').replace('</script', '<\\/script')
    return '<script type="module">' + js + '</script>'

html = re.sub(r'<link rel="stylesheet" crossorigin href="([^"]+)">', inline_css, html)
html = re.sub(r'<script type="module" crossorigin src="([^"]+)"></script>', inline_js, html)
(out / 'app.html').write_text(html, encoding='utf-8')
print('wrote', out / 'app.html', round(len(html) / 1024), 'KB')

# Artifact variant: the host supplies <html>/<head>/<body>, so emit only the page parts.
title = re.search(r'<title>.*?</title>', html, re.S).group(0)
links = ''.join(re.findall(r'<link [^>]*fonts[^>]*>', html))
styles = ''.join(re.findall(r'<style>.*?</style>', html, re.S))
scripts = ''.join(re.findall(r'<script type="module">.*?</script>', html, re.S))
(out / 'artifact.html').write_text(title + links + styles + '<div id="root"></div>' + scripts, encoding='utf-8')
print('wrote', out / 'artifact.html')
