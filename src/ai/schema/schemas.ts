export const jointjsPrimitiveSchema = `{
	"type": "object",
	"properties": {
	  "type": { "type": "string" },
	  "position": {
		"type": "object",
		"properties": {
		  "x": { "type": "number" },
		  "y": { "type": "number" }
		},
		"required": ["x", "y"]
	  },
	  "size": {
		"type": "object",
		"properties": {
		  "width": { "type": "number" },
		  "height": { "type": "number" }
		},
		"required": ["width", "height"]
	  },
	
	  "id": { "type": "number" },
   
	  "attrs": {
		"type": "object",
		"properties": {
		  "body": {
			"type": "object",
			"properties": {
			  "fill": { "type": "string" },
			  "fillOpacity": { "type": "number" }
			},
			"required": ["fill", "fillOpacity"]
		  },
		  "label": {
			"type": "object",
			"properties": {
			  "text": { "type": "string" }
			},
			"required": ["text"]
		  }
		},
		"required": ["body", "label", ]
	  }
	},
	"required": ["type", "position", "size", "id", "attrs"]
  }`

export const jointjsLinkSchema = `{
	"type": "object",
	"properties": {
	  "type": { "type": "string" },
	  "source": {
		"type": "object",
		"id": { "type": "string" },
		"required": ["id"]
	  },
	  "target": {
		"type": "object",
		"id": { "type": "string" },
		"required": ["id"]
	  },
	  "id": { "type": "number" },
	  "vertices": {
		"type": "array",
		"items": {
		  "type": "object",
		  "properties": {
			"x": { "type": "number" },
			"y": { "type": "number" }
		  },
		  "required": ["x", "y"]
		}
	  },
	  "attrs": {
		"type": "object",
		"properties": {
		  "line": {
			"type": "object",
			"properties": {
			  "stroke": { "type": "string" }
			},
			"required": ["stroke"]
		  },
		  "root": {
			"type": "object",
			"properties": {
			  "tabindex": { "type": "number" },
			  "title": { "type": "string" }
			},
			"required": ["tabindex", "title"]
		  }
		},
		"required": ["line", "root"]
	  }
	},
	"required": ["type", "source", "target", "id", "vertices", "attrs"]
  }`
