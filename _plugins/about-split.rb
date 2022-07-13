module Jekyll
	class AboutSplit < Liquid::Tag
		def render(context)
			"<!-- ABOUT -->"
		end
	end
end

Liquid::Template.register_tag('about', Jekyll::AboutSplit)
