import { defineStore } from 'pinia'
import type { CustomElementView, Diagram } from '@/types/general'
import { HierarchyStore } from '@/services/hierarchy-store.service'
import { dia, elementTools, linkTools, shapes } from 'jointjs'
import { useConfigStore } from './config'
import { HierarchyItem, ToolsViewItem } from '@/model/hierarchy.model'
import { ref } from 'vue'

export const useDiagramStore = defineStore('diagram', () => {
  const hierarchyStore = new HierarchyStore()
  const graph = new dia.Graph([], { cellNamespace: shapes })
  const paper = ref<dia.Paper>(new dia.Paper({}))

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
    if (configStore.updatePerChange) {
      configStore.updateParentWindowWithGraph(graph.toJSON())
    }
  }
  //
  // End global graph events

  //
  // Data Insertion
  //

  function insertDiagramData(data: Diagram | string) {
    if (typeof data == 'string') {
      data = JSON.parse(data)
    }

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
    const boundaryTool = new elementTools.Boundary()

    const toolsView = new dia.ToolsView({
      tools: [boundaryTool]
    })

    const elementView: CustomElementView = element.findView(
      paper.value as dia.Paper
    ) as CustomElementView

    elementView.addTools(toolsView)
    elementView.hideTools()

    elementView.id = element.id.toString()

    const hierarchyItem = new HierarchyItem({
      id: elementView.id,
      name: element.attr('label/text'),
      element: element,
      toolsViewList: [new ToolsViewItem('hover', toolsView)]
    })

    hierarchyStore.add(hierarchyItem)

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

  // Method to zoom into the diagram
  function zoomIn() {
    // Get the current scale of the paper
    const currentScale = paper.value.scale()
    // Increase both x and y scale factors by 10% for zooming in
    paper.value.scale(currentScale.sx * 1.1, currentScale.sy * 1.1)
  }

  // Method to zoom out of the diagram
  function zoomOut() {
    // Get the current scale of the paper
    const currentScale = paper.value.scale()
    // Decrease both x and y scale factors by 10% for zooming out
    paper.value.scale(currentScale.sx * 0.9, currentScale.sy * 0.9)
  }

  // Method to set a specific zoom level
  function setZoomLevel(zoomLevel: number) {
    // Set both x and y scale factors to the specified zoom level
    paper.value.scale(zoomLevel, zoomLevel)
  }

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
    zoomIn,
    zoomOut,
    setZoomLevel,
    isViewPortLocked
  }
})
