require 'pathname'

module Jekyll
	module RelativePath
		def relative_path(url)
			pageUrl = @context.registers[:page]["url"]
			pageDir = Pathname(pageUrl).parent
			Pathname(url).relative_path_from(pageDir).to_s
		end
	end
end

Liquid::Template.register_filter(Jekyll::RelativePath)
