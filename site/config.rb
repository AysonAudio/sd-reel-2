# Customize directory structure
# https://middlemanapp.com/advanced/configuration/

set :source, 'src'
set :fonts_dir, 'fonts'
set :images_dir, 'assets'
set :layouts_dir, 'page'
set :css_dir, 'scss'
set :js_dir, 'artifacts'
set :index_file, 'index.html'

# Configure environments
# https://middlemanapp.com/advanced/configuration/#environment-specific-settings

configure :development do
  activate :livereload, ignore: ['ts/*']
end

configure :build do
  ignore 'ts/*'
  activate :minify_css
  activate :minify_html, preserve_line_breaks: true
  activate :minify_javascript, compressor: Terser.new
  activate :asset_hash
end

# Activate and configure extensions
# https://middlemanapp.com/advanced/configuration/#configuring-extensions

activate :autoprefixer do |prefix|
  prefix.browsers = "last 2 versions"
end

# Set default layouts
# https://middlemanapp.com/basics/layouts/

set :layout, 'head'
