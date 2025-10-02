// import api methods
import collection from './api/selectors/collection'
import doc from './api/selectors/doc'

import orderBy from './api/filters/orderBy'
import limit from './api/filters/limit'

import get from './api/actions/get'
import add from './api/actions/add'
import update from './api/actions/update'
import set from './api/actions/set'
import deleteIt from './api/actions/delete'

import type LocalForage from 'localforage'

interface DeleteCollectionQueue {
  queue: string[]
  running: boolean
}

interface OmborConfig {
  debug: boolean
}

type DocSelectionCriteria = string | { [key: string]: unknown }

// Ombor
export default class Ombor {
  dbName: string
  lf: { [key: string]: LocalForage } // where we store our localForage instances
  collectionName: string | null
  orderByProperty: string | null
  orderByDirection: 'asc' | 'desc' | null
  limitBy: number | null
  docSelectionCriteria: DocSelectionCriteria | null
  deleteCollectionQueue: DeleteCollectionQueue
  config: OmborConfig
  userErrors: string[]

  // API methods
  collection: typeof collection
  doc: typeof doc
  orderBy: typeof orderBy
  limit: typeof limit
  get: typeof get
  add: typeof add
  update: typeof update
  set: typeof set
  delete: typeof deleteIt

  constructor(dbName: string) {
    // properties
    this.dbName = dbName
    this.lf = {} // where we store our localForage instances
    this.collectionName = null
    this.orderByProperty = null
    this.orderByDirection = null
    this.limitBy = null
    this.docSelectionCriteria = null

    // queues
    this.deleteCollectionQueue = {
      queue: [],
      running: false
    }

    // config
    this.config = {
      debug: true
    }

    // user errors - e.g. wrong type or no value passed to a method
    this.userErrors = []

    // api - selectors
    this.collection = collection.bind(this)
    this.doc = doc.bind(this)

    // api - filters
    this.orderBy = orderBy.bind(this)
    this.limit = limit.bind(this)

    // api - actions
    this.get = get.bind(this)
    this.add = add.bind(this)
    this.update = update.bind(this)
    this.set = set.bind(this)
    this.delete = deleteIt.bind(this)
  }
}
