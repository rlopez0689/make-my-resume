import base64
import tempfile

from django.template.loader import render_to_string


def image_file_path_to_base64_string(filepath: str) -> str:
    with open(filepath, 'rb') as f:
        return base64.b64encode(f.read()).decode()


def add_pdf_header(path_file: str, options: dict, context: dict) -> dict:
    with tempfile.NamedTemporaryFile(suffix='.html', delete=False) as header:
        options['header-html'] = header.name
        options['header-spacing'] = '6'
        header.write(
            render_to_string(path_file, context).encode('utf-8')
        )
    return options


def add_pdf_footer(options):
    options['footer-center'] = '[page]'
    return options
