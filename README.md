<a href=""><img width="200px" alt="emp logo not found" src="https://github.com/wiredolphin/emphasizer/blob/master/images/emphasizer_logo_01.png" /></a>

# Emphasizer
<p>Smart, modern, quick configurable and high customizable source code syntax highlighter for the web, written in pure Javascript!<p>

## Quickstart


## Main features

+ Requires only one script file to be added into the page, and you are ready to go!
+ Supports all browser included older ones (ie >= 8)
+ Highlights multiple language in one single listing making use of tags like <code>&lt;script&gt;</code>, <code>&lt;style&gt;</code>, <code>&lt;?php</code> as well as <code>&lt;inline&gt;</code>, allowing to exhibit a full php or xhtml page with embedded styles, scripts, php code and html, or you can combine for example c++ code with other programming languages
+ Fully customizable simply passing options as a constructor argument
+ Easily changes visual theme by only setting an option entry, or changing it dinamically using APIs, Emphasizer  will care about loading the necessary file
+ 3 different visualization modality:
    +  break lines mode: long lines continues to the next line
    +  anchored line numbers mode: line numbers will be locked on the left side while horizontal scrolling the code
    +  normal mode: line numbers will horizontally scroll with the code and disappear while scrolling to the right
+ Enable/disable line numbers through options
+ Asynchronously load source code file, without embed code into the page
+ Customizable toolbar with:
    +  print syntax highlighted code function
    +  select full code function
    +  open code in plain text in a modal dialog
    +  open about dialog
    +  file name display
+ User can select the full code by double clicking anywhere inside the container
+ Styled scrollbars, unique and identical in all browsers, displayed only when the source code container
  is smaller than the code listing itself
+ Easly extensible: fallowing a few rules is required to add other programming languages or a new visual theme
+ Featured by APIs

## Setup Emphasizer

+ Download the compressed archive,
+ uncompress and move it to your site folder,
+ simply add a reference to the <code>emphasizer.js</code> file into the <code>&lt;head&gt;</code> section of the page, paying attention to use the correct path. No further reference are needed.

<div><p>Now you can use default options or provide yours and create an instance of
Emphasizer like so:</p></div>
<div>
    <code>var emp = new <strong>Emphasizer</strong>('selector', 'programming-languages', options);</code>
</div>
<br>
where:

+ <strong>selector</strong>: is the selector string referencing the html element containing the source code
+ <strong>programming-languages</strong>: is a comma separated string containing one or multiple programming languages, emphasizer automatically loads the necessary files
+ <strong>options</strong>: is a key-value object containing your setup, omit it to use defaults

<div><p>Job done!</div>
<div><p>See it in action <a href='http://wiredolphin.net'>here</a></p></div>

## License

See <a href="https://github.com/wiredolphin/emphasizer/blob/master/license">here</a>
