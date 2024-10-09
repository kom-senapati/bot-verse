from jinja2.ext import Extension

def boldItalics(inputText):
    # simple bold markdown command
    outputText = ""
    j = 0
    i = 0
    while i < len(inputText):
        if i < len(inputText) - 2:
            if (inputText[i] == "*" and inputText[i+1] == "*" and inputText[i+2] == "*" and i<len(inputText)-3):
                for j in range(i+3, len(inputText)):
                    if inputText[j]=="*" and inputText[j+1]=="*" and inputText[j+2]=="*":
                        outputText += "<strong><em>" + inputText[i + 3:j] + "</em></strong>"
                        i += 3 + j - i
                        break
            else:
                outputText += inputText[i]
                i += 1
        else:
            outputText += inputText[i]
            i+=1

    return outputText

def bold(inputText):
    # simple bold markdown command
    outputText = ""
    j = 0
    i = 0
    while i < len(inputText):
        if i < len(inputText) - 1:
            if (inputText[i] == "*" and inputText[i+1] == "*" and i<len(inputText)-1):
                for j in range(i+2, len(inputText)):
                    if inputText[j]=="*" and inputText[j+1]=="*":
                        outputText += "<strong>" + inputText[i + 2:j] + "</strong>"
                        i += 2 + j - i
                        break
            else:
                outputText += inputText[i]
                i += 1
        else:
            outputText += inputText[i]
            i+=1

    return outputText

def italics(inputText):
    # simple italics markdown command same as bold
    outputText = ""
    previousSection = 0
    j = 0
    i = 0
    while i < len(inputText):
        if (inputText[i] == "*" ):
            for j in range(i+1, len(inputText)):
                if inputText[j]=="*":
                    outputText += "<em>" + inputText[i + 1:j] + "</em>"
                    i += 1 + j - i
                    break
        else:
            outputText += inputText[i]
            i+=1

    return outputText

def heading(inputText):
    if inputText[0] == "#":
        i = 1
        while inputText[i] != " ":
            i += 1
        outputText = "<h" + str(i) + ">" + inputText[i+1:] + "</h" + str(i) + ">"
        return outputText
    else:
        return inputText

def image(inputText):
    imageAlt = ""
    imageSource =""
    if inputText[0] == "!":
        i = 0
        if inputText[1] == "[":
            i += 2
            while i < len(inputText):
                if inputText[i] == "]":
                    break
                else:
                    imageAlt += inputText[i]
                    i += 1

        if inputText[i+1] == "(":
            j=i + 2
            while j < len(inputText):
                if inputText[j] == ")":
                    break
                else:
                    imageSource += inputText[j]
                    j += 1

        outputText = "<img src=" + imageSource + " alt=" + imageAlt + ">"
        return outputText
    else:
        return  inputText

def link(inputText):
    linkText = ""
    linkAddress = ""
    outputText = ""
    i = 0
    link = False
    while i < len(inputText)-1:
        if inputText[i] == "[":
            link = True
            i += 1
            x = i
            while x < len(inputText):
                if inputText[x] == "]":
                    break
                else:
                    linkText += inputText[x]
                    x += 1
            i = x

        elif inputText[i + 1] == "(":
            j = i + 2
            while j < len(inputText):
                if inputText[j] == ")":
                    break
                else:
                    linkAddress += inputText[j]
                    j += 1
            i = j + 1
        else:
            outputText += inputText[i]
            i+=1

    if(link):
        outputText += "<a href=" + linkAddress + ">" + linkText + "</a>"
    outputText += inputText[len(inputText)-1]
    return outputText

def lineBreak(inputText):
    outputText = ""
    previousSection = 0
    stopPharsing = -2
    i = 0
    while i < len(inputText):
        if(i!=len(inputText)-1):
            if inputText[i] == " " and inputText[i+1] == " ":
                outputText += "<br>"
                i+=2
            else:
                outputText += inputText[i]
                i+=1
        else:
            outputText += inputText[i]
            i += 1

    return outputText

def applyMarkdown(inputText):
    outputText = inputText
    #apply image first
    outputText = image(outputText)
    outputText = link(outputText)
    # boldItalics, bold and italics must be ordered from most *** to least *. This is so they are not confused amongst each other
    outputText = boldItalics(outputText)
    outputText = bold(outputText)
    outputText = italics(outputText)

    outputText = heading(outputText)
    outputText = lineBreak(outputText)
    return outputText

def markdown(inputText):
    #actual markdown package
    lineStart = 0
    lineEnd = 0
    currentLine = ""
    outputText = ""
    while lineEnd != len(inputText):
        if inputText[lineEnd:lineEnd + 2]=="\n\n":
            currentLine = inputText[lineStart:lineEnd]
            currentLine = applyMarkdown(currentLine)
            outputText += "<p>" + currentLine + "</p>"
            lineEnd += 2
            lineStart = lineEnd
        if inputText[lineEnd:lineEnd + 4] == "<br>":
            currentLine = inputText[lineStart:lineEnd]
            currentLine = applyMarkdown(currentLine)
            outputText += "<p>" + currentLine + "</p>"
            lineEnd += 4
            lineStart = lineEnd
        lineEnd += 1
    currentLine = inputText[lineStart:lineEnd]
    currentLine = applyMarkdown(currentLine)
    outputText += "<p>" + currentLine + "</p>"

    return outputText






class markdownExtension(Extension):
    def __init__(self, environment):
        super(markdownExtension, self).__init__(environment)
        environment.filters['bold'] = bold
        environment.filters['italics'] = italics
        environment.filters['boldItalics'] = boldItalics
        environment.filters['heading'] = heading
        environment.filters['image'] = image
        environment.filters['link'] = link
        environment.filters['lineBreak'] = lineBreak
        environment.filters['markdown'] = markdown