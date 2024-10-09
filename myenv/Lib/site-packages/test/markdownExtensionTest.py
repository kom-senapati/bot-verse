from jinja2 import Environment
from jinja2 import Template
from jinjaMarkdown.markdownExtension import markdownExtension

environment: Environment = Environment(extensions=[markdownExtension])

def test_bold():
    template: Template = environment.from_string("""{{ "abc" | bold }}""")
    assert template.render() == "abc"
    template: Template = environment.from_string("""{{ "**abc**" | bold }}""")
    assert template.render() == "<strong>abc</strong>"
    template: Template = environment.from_string("""{{ "**bold** again **bold** **bold** again **bold**" | bold }}""")
    assert template.render() == "<strong>bold</strong> again <strong>bold</strong> <strong>bold</strong> again <strong>bold</strong>"
    template: Template = environment.from_string("""{{ "hello **bold** bye wait **bold** again **bold**" | bold }}""")
    assert template.render() == "hello <strong>bold</strong> bye wait <strong>bold</strong> again <strong>bold</strong>"

def test_italics():
    template: Template = environment.from_string("""{{ "abc" | italics }}""")
    assert template.render() == "abc"
    template: Template = environment.from_string("""{{ "*abc*" | italics }}""")
    assert template.render() == "<em>abc</em>"
    template: Template = environment.from_string("""{{ "*italics* again *italics* *italics* again *italics*" | italics }}""")
    assert template.render() == "<em>italics</em> again <em>italics</em> <em>italics</em> again <em>italics</em>"
    template: Template = environment.from_string("""{{ "hello *italics* bye wait *italics* again *italics*" | italics }}""")
    assert template.render() == "hello <em>italics</em> bye wait <em>italics</em> again <em>italics</em>"

def test_boldItalics():
    template: Template = environment.from_string("""{{ "abc" | boldItalics }}""")
    assert template.render() == "abc"
    template: Template = environment.from_string("""{{ "***boldItalics*** again ***boldItalics*** ***boldItalics*** again ***boldItalics***" | boldItalics }}""")
    assert template.render() == "<strong><em>boldItalics</em></strong> again <strong><em>boldItalics</em></strong> <strong><em>boldItalics</em></strong> again <strong><em>boldItalics</em></strong>"
    template: Template = environment.from_string("""{{ "hello ***boldItalics*** bye wait ***boldItalics*** again ***boldItalics***" | boldItalics }}""")
    assert template.render() == "hello <strong><em>boldItalics</em></strong> bye wait <strong><em>boldItalics</em></strong> again <strong><em>boldItalics</em></strong>"

def test_heading():
    template: Template = environment.from_string("""{{ "abc" | heading }}""")
    assert template.render() == "abc"

    template: Template = environment.from_string("""{{ "# abc" | heading }}""")
    assert template.render() == "<h1>abc</h1>"

    template: Template = environment.from_string("""{{ "##### hello bold bye" | heading }}""")
    assert template.render() == "<h5>hello bold bye</h5>"

def test_image():
    template: Template = environment.from_string("""{{ "![city](https://ichef.bbci.co.uk/news/976/cpsprodpb/12A9B/production/_111434467_gettyimages-1143489763.jpg)" | image }}""")
    assert template.render() == "<img src=https://ichef.bbci.co.uk/news/976/cpsprodpb/12A9B/production/_111434467_gettyimages-1143489763.jpg alt=city>"

def test_link():
    template: Template = environment.from_string("""{{ "My favorite search engine is [Duck Duck Go](https://duckduckgo.com)." | link }}""")
    assert template.render() == "My favorite search engine is <a href=https://duckduckgo.com>Duck Duck Go</a>."

def test_lineBreaks():
    template: Template = environment.from_string("""{{ "This is the first line.  \nAnd this is the second line." | lineBreak }}""")
    assert template.render() == "This is the first line.<br>\nAnd this is the second line."

    template: Template = environment.from_string("""{{ "abc  \ndef  \nghi    " | lineBreak }}""")
    assert template.render() == "abc<br>\ndef<br>\nghi<br><br>"

def test_markdown():
    template: Template = environment.from_string("""{{ "abc" | markdown }}""")
    assert template.render() == "<p>abc</p>"

    template: Template = environment.from_string("""{{ "abc\n\ndef" | markdown }}""")
    assert template.render() == "<p>abc</p><p>def</p>"

    template: Template = environment.from_string("""{{ "# abc\n\n**def**" | markdown }}""")
    assert template.render() == "<p><h1>abc</h1></p>" \
                                "<p><strong>def</strong></p>"
    template: Template = environment.from_string("""{{ "I really like using Markdown.\n\nI think I'll use it to format all of my documents from now on." | markdown }}""")
    assert template.render() == "<p>I really like using Markdown.</p><p>I think I'll use it to format all of my documents from now on.</p>"

    template: Template = environment.from_string("""{{ "abc\n\ndef" | markdown }}""")
    assert template.render() == "<p>abc</p><p>def</p>"

    template: Template = environment.from_string("""{{ "***yo*** im writing stuff!  \n*crazy* **right**\n\nAnyways**...**" | markdown }}""")
    assert template.render() == "<p><strong><em>yo</em></strong> im writing stuff!<br>\n<em>crazy</em> <strong>right</strong></p><p>Anyways<strong>...</strong></p>"

    template: Template = environment.from_string("""{{ "*20* <br>## 20" | markdown }}""")
    assert template.render() == "<p><em>20</em> </p><p><h2>20</h2></p>"


    template: Template = environment.from_string(
        """{{ "***hey*** I'm writing stuff!  \n*crazy* **right**\n\nAnyways**...**\n\n![dinosaur!](https://www.example.com/images/dinosaur.jpg) \n\nMy favorite search engine is [Duck Duck Go](https://duckduckgo.com)." | markdown }}""")
    assert template.render() == "<p><strong><em>hey</em></strong> I'm writing stuff!<br>\n<em>crazy</em> <strong>right</strong></p><p>Anyways<strong>...</strong></p><p><img src=https://www.example.com/images/dinosaur.jpg alt=dinosaur!></p><p>My favorite search engine is <a href=https://duckduckgo.com>Duck Duck Go</a>.</p>"