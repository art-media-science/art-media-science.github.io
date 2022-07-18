# Adapted from this: https://gist.github.com/anonymous/bea7d7389b7331bba512
# Which is based on this: https://github.com/rustygeldmacher/jekyll-contentblocks



module Jekyll
	module ContentBlocks
		class PreRenderHook
			def self.call(document, payload)
				payload['converters'] = document.site.converters.select do |converter|
					file_extension = File.extname(document.path)
					converter.matches(file_extension)
				end
				payload['contentblocks'] = {}
			end
		end
		module ContentBlockTag
			attr_accessor :content_block_name
			attr_accessor :content_block_options

			def initialize(tag_name, markup, tokens)
				super
				parse_options(markup)
				if content_block_name == ''
					raise SyntaxError.new("No block name given in #{tag_name} tag")
				end
			end

			private

			def parse_options(markup)
				options = (markup || '').split(' ').map(&:strip)
				self.content_block_name = options.shift
				self.content_block_options = options
			end

			def block_has_content?(context)
				block_content = content_for_block(context).join
				!(block_content.nil? || block_content.empty?)
			end

			def content_for_block(context)
				environment = context.environments.first
				environment['contentblocks'] ||= {}
				environment['contentblocks'][content_block_name] ||= []
			end
		end
	end
	module Tags
		class ContentFor < Liquid::Block
			include ::Jekyll::ContentBlocks::ContentBlockTag
			alias_method :render_block, :render

			def render(context)
				content_for_block(context) << render_block(context)
				''
			end
		end
		class ContentBlock < Liquid::Tag
			include ::Jekyll::ContentBlocks::ContentBlockTag

			def render(context)
				block_content = content_for_block(context).join
				if convert_content?
					converted_content(block_content, context)
				else
					block_content
				end
			end

			private

			def convert_content?
				!content_block_options.include?('no-convert')
			end

			def converted_content(block_content, context)
				converters = context.environments.first['converters']
				Array(converters).reduce(block_content) do |content, converter|
					converter.convert(content)
				end
			end
		end
	end
end

[:documents, :pages, :posts].each do |content_type|
	Jekyll::Hooks.register content_type, :pre_render do |doc, payload|
		Jekyll::ContentBlocks::PreRenderHook.call(doc, payload)
	end
end

Liquid::Template.register_tag('section', Jekyll::Tags::ContentFor)
Liquid::Template.register_tag('section_content', Jekyll::Tags::ContentBlock)
