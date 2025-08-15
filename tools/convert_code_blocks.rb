#!/usr/bin/env ruby

# Script to convert WordPress-style code blocks to Jekyll/Markdown format
# This will help convert existing posts to work better with the new theme

require 'fileutils'

def convert_code_blocks(content)
  # Convert WordPress code blocks to Jekyll code blocks
  content.gsub(/<!-- wp:code -->\s*<pre class="wp-block-code"><code>(.*?)<\/code><\/pre>\s*<!-- \/wp:code -->/m) do |match|
    code_content = $1
    
    # Decode HTML entities
    code_content = code_content.gsub('&lt;', '<')
                              .gsub('&gt;', '>')
                              .gsub('&amp;', '&')
                              .gsub('&#91;', '[')
                              .gsub('&#93;', ']')
    
    # Try to detect language from content
    language = detect_language(code_content)
    
    # Return as Jekyll code block
    "```#{language}\n#{code_content}\n```"
  end
end

def detect_language(code)
  # Simple language detection based on content patterns
  return 'ruby' if code.include?('class ') && code.include?('def ') && code.include?('end')
  return 'ruby' if code.include?('Rails') || code.include?('ActiveRecord')
  return 'erb' if code.include?('<%') && code.include?('%>')
  return 'html' if code.include?('<div') || code.include?('<span')
  return 'css' if code.include?('{') && code.include?(':') && code.include?(';')
  return 'javascript' if code.include?('function') || code.include?('const ') || code.include?('let ')
  return 'bash' if code.include?('$') || code.include?('cd ') || code.include?('mkdir')
  return 'yaml' if code.include?('---') || code.match(/^\s*\w+:\s/)
  
  # Default to text if we can't detect
  ''
end

def process_file(file_path)
  puts "Processing: #{file_path}"
  
  content = File.read(file_path)
  original_content = content.dup
  
  # Convert code blocks
  content = convert_code_blocks(content)
  
  # Only write if content changed
  if content != original_content
    File.write(file_path, content)
    puts "  ✓ Updated code blocks"
  else
    puts "  - No changes needed"
  end
end

# Process all markdown files in _posts directory
posts_dir = File.join(File.dirname(__FILE__), '..', '_posts')
Dir.glob(File.join(posts_dir, '*.md')).each do |file|
  process_file(file)
end

puts "\nCode block conversion complete!"
