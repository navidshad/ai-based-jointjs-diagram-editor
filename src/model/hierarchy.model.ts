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

  static is(item: HierarchyItem): item is HierarchyItem {
    return item.element.prop('data/type') !== 'group'
  }

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

  get isGroup() {
    return this.element.prop('data/type') == 'group'
  }

  getToolsView(type: ToolsViewType) {
    return this.toolsViewList.find((item) => item.type == type)
  }

  changeLabel(name: string) {
    this.name = name
    this.element.attr('label/text', this.name)
  }
}

export class HierarchyGroupItem extends HierarchyItem {
  private previousPosition: dia.Point

  static is(item: HierarchyItem): item is HierarchyGroupItem {
    return item.element.prop('data/type') == 'group'
  }

  constructor(data: {
    id: string
    name: string
    element: dia.Element
    toolsViewList: ToolsViewItem[]
  }) {
    super(data)

    this.previousPosition = this.element.position()

    // @ts-ignore
    this.element.on('change:position', this.onPositionChanged, this)
  }

  get ChieldsId() {
    return this.element.prop('data/embeds') || []
  }

  private onPositionChanged(_element: dia.Element, position: dia.Point) {
    const xd = position.x - this.previousPosition.x
    const yd = position.y - this.previousPosition.y
    this.previousPosition = position

    for (let i = 0; i < this.ChieldsId.length; i++) {
      const id = this.ChieldsId[i]

      const child = this.element.graph.getCell(id) as dia.Element
      if (!child) continue

      // const childPosition = child.position()
      child.translate(xd, yd)
    }
  }
}
