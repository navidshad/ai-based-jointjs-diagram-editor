import { dia } from 'jointjs'

export type ToolsViewType = 'hover' | 'valid-for-link'

export class ToolsViewItem {
  type: ToolsViewType
  toolsView: dia.ToolsView

  constructor(type: ToolsViewType, toolsView: dia.ToolsView) {
    this.type = type
    this.toolsView = toolsView
  }
}

export class HierarchyItem {
  id: string
  name: string
  element: dia.Element
  toolsViewList: ToolsViewItem[]

  constructor(data: {
    id: string
    name: string
    element: dia.Element
    toolsViewList: ToolsViewItem[]
  }) {
    this.id = data.id
    this.name = data.name
    this.element = data.element
    this.toolsViewList = data.toolsViewList
  }

  getToolsView(type: ToolsViewType) {
    return this.toolsViewList.find((item) => item.type == type)
  }

  changeLabel(name: string) {
    this.element.attr('label/text', this.name)
    this.name = name
  }
}
