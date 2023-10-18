import { TinyEmitter } from 'tiny-emitter'
import { HierarchyItem } from '../model/hierarchy.model'

export class HierarchyStore {
  private _data: HierarchyItem[] = []
  _eventBus = new TinyEmitter()

  get data() {
    return this._data as Readonly<HierarchyItem[]>
  }

  clear() {
    this._data = []
    this._eventBus.emit('add', null)
  }

  blurAll() {
    this._data.forEach((item) => {
      item.getToolsView('hover')?.toolsView.hide()
    })
  }

  activeItem(item: HierarchyItem | undefined | null) {
    if (!item) return

    this.blurAll()
    item.getToolsView('hover')?.toolsView.show()
  }

  add(item: HierarchyItem) {
    const index = this._data.findIndex((i) => i.id == item.id)
    if (index == -1) {
      this._data.push(item)
      this._eventBus.emit('add', item)
    }
  }

  find(id: string) {
    return this._data.find((item) => item.id == id)
  }

  // remove(id: string) {
  //   const index = this._data.findIndex((i) => i.id == id)
  //   if (index == -1) return

  //   const removed = this._data.splice(index, 1)
  //   this._eventBus.emit('remove', removed[0])
  // }

  addEvent(type: 'add' | 'remove' | 'select', callback: (item: HierarchyItem) => void) {
    this._eventBus.on(type, callback)
  }

  removeEvent(type: 'add' | 'remove' | 'select', callback: (item: HierarchyItem) => void) {
    this._eventBus.off(type, callback)
  }
}
