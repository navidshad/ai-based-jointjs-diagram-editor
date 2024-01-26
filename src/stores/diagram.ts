import { defineStore } from 'pinia'
import type { CustomElementView, Diagram } from '@/types/general'
import { HierarchyStore } from '@/services/hierarchy-store.service'
import { dia, elementTools, linkTools, shapes } from 'jointjs'
import { useConfigStore } from './config'
import { HierarchyGroupItem, HierarchyItem, ToolsViewItem } from '@/model/hierarchy.model'
import { ref } from 'vue'

class ResizeTool extends elementTools.Control {
  protected getPosition(view: dia.ElementView): dia.Point {
    // @ts-ignore
    const model = view.model
    const { width, height } = model.size()
    return { x: width, y: height }
  }

  protected setPosition(view: dia.ElementView, coordinates: dia.Point): void {
    // @ts-ignore
    const model = view.model
    model.resize(Math.max(coordinates.x, 1), Math.max(coordinates.y, 1))
  }
}

export const useDiagramStore = defineStore('diagram', () => {
  const hierarchyStore = new HierarchyStore()
  const graph = new dia.Graph([], { cellNamespace: shapes })
  const paper = {
    value: new dia.Paper({})
  }

  function addPaper(options: dia.Paper.Options) {
    paper.value = new dia.Paper(options)
  }

  //
  // Global graph events
  //

  // @ts-ignore
  graph.on('change', () => onChange())
  // @ts-ignore
  graph.on('add', () => onChange())
  // @ts-ignore
  graph.on('remove', () => onChange())

  const configStore = useConfigStore()
  function onChange() {
    if (configStore.updatePerChange == true) {
      configStore.updateParentWindowWithGraph(graph.toJSON())
    }
  }
  // End global graph events
  //

  //
  // Data Insertion
  //

  function insertDiagramData(data: Diagram | string) {
    if (typeof data == 'string') {
      data = JSON.parse(data)
    }

    graph.clear()

    try {
      graph.fromJSON(data)
      hierarchyStore.clear()

      graph.getElements().forEach((el) => {
        addStandardToolsViewsForElement(el)
      })

      graph.getLinks().forEach((el) => {
        addStandardToolsViewsForLink(el)
      })
    } catch (error) {
      console.error('Error while parsing diagram data', error)
    }

    // Update parent window with graph
    useConfigStore().updateParentWindowWithGraph(data as Diagram)
  }

  function addElement(element: dia.Element) {
    element.addTo(graph)
    addStandardToolsViewsForElement(element)
  }

  function addLink(source: dia.Element, target: dia.Element) {
    const link = new shapes.standard.Link()

    link.source(source)
    link.target(target)

    link.addTo(graph)

    addStandardToolsViewsForLink(link)
  }

  function addElementFromJson(json: any) {
    if (typeof json == 'string') {
      json = JSON.parse(json)
    }

    if (json.id == null) {
      json.id = new Date().getTime()
    }

    graph.addCell(json)
    const cell = graph.getCell(json.id)
    addStandardToolsViewsForElement(cell as dia.Element)
  }

  function addStandardToolsViewsForElement(element: dia.Element) {
    const tools: dia.ToolView[] = [
      // Shows boundary box around selected element
      new elementTools.Boundary()
    ]

    // if image
    // Add size controller for selected element
    if (element.attr('image/xlinkHref')) {
      tools.push(
        new ResizeTool({
          selector: 'image',
          handleAttributes: {
            fill: '#4666E5'
          }
        })
      )
    }

    // if primitive
    // Add size controller for selected element
    if (element.attr('body/fill')) {
      tools.push(
        new ResizeTool({
          selector: 'body',
          handleAttributes: {
            fill: '#4666E5'
          }
        })
      )
    }

    const toolsView = new dia.ToolsView({
      tools: tools
    })

    const elementView: CustomElementView = element.findView(
      paper.value as dia.Paper
    ) as CustomElementView

    elementView.addTools(toolsView)
    elementView.hideTools()

    elementView.id = element.id.toString()

    const isGroup = element.prop('data/type') == 'group'

    if (isGroup) {
      hierarchyStore.add(
        new HierarchyGroupItem({
          id: elementView.id,
          name: element.attr('label/text'),
          element: element,
          toolsViewList: [new ToolsViewItem('hover', toolsView)]
        })
      )
    } else {
      hierarchyStore.add(
        new HierarchyItem({
          id: elementView.id,
          name: element.attr('label/text'),
          element: element,
          toolsViewList: [new ToolsViewItem('hover', toolsView)]
        })
      )
    }

    // activate wrap text
    element.attr('label/textWrap', {
      width: element.size().width,
      height: element.size().height,
      ellipsis: true
    })
  }

  function addStandardToolsViewsForLink(link: dia.Link) {
    // Add remove button to the link.
    const tools = new dia.ToolsView({
      tools: [new linkTools.Remove()]
    })

    link.findView(paper.value as dia.Paper).addTools(tools)
  }
  // End of Data Insertion
  //

  //
  // Viewport controller methods
  //
  const isViewPortLocked = ref(false)
  //
  // Method to set the viewport position to specified x and y coordinates
  function setViewportPosition(x: number, y: number) {
    if (isViewPortLocked.value) {
      return
    }

    const { tx, ty } = paper.value.translate()
    // Uses JointJS's translate method to move the paper
    paper.value.translate(tx + x, ty + y)
  }

  // Method to set a specific zoom level
  function setZoomLevel(zoomLevel: number) {
    // Set both x and y scale factors to the specified zoom level
    paper.value.scale(zoomLevel, zoomLevel)
  }

  function handleMouseWheel(event: WheelEvent) {
    event.preventDefault() // Prevent default scrolling behavior

    const currentScale = paper.value.scale() // Get the current scale
    const zoomFactor = 0.1 // Define how much to zoom in or out
    let newScale = 0

    if (event.deltaY < 0) {
      // Mouse wheel moved up, zoom in
      newScale = Math.min(currentScale.sx + zoomFactor, 20) // Set a max zoom limit
    } else {
      // Mouse wheel moved down, zoom out
      newScale = Math.max(currentScale.sx - zoomFactor, 0.1) // Set a min zoom limit
    }

    // Apply the new scale
    paper.value.scale(newScale, newScale)
  }
  // End of Viewport controller methods
  //

  return {
    graph,
    paper,
    hierarchyStore,

    insertDiagramData,
    addLink,
    addPaper,
    addElement,
    addElementFromJson,
    addStandardToolsViewsForElement,
    addStandardToolsViewsForLink,

    setViewportPosition,
    setZoomLevel,
    isViewPortLocked,
    handleMouseWheel
  }
})
