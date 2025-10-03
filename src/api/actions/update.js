import logger from '../../utils/logger'
import isSubset from '../../utils/isSubset'
import updateObject from '../../utils/updateObject'
import success from '../../api-utils/success'
import error from '../../api-utils/error'
import showUserErrors from '../../api-utils/showUserErrors'

export default function update(docUpdates) {
  const collectionName = this.collectionName
  const docSelectionCriteria = this.docSelectionCriteria

  return new Promise((resolve, reject) => {
    // update document by criteria
    this.updateDocumentByCriteria = () => {
      const docsToUpdate = []
      this.lf[collectionName]
        .iterate((value, key) => {
          if (isSubset(value, docSelectionCriteria)) {
            const newDocument = updateObject(value, docUpdates)
            docsToUpdate.push({
              key,
              newDocument
            })
          }
        })
        .then(() => {
          if (!docsToUpdate.length) {
            logger.error.call(
              this,
              `${JSON.stringify(docSelectionCriteria)} bilan ${collectionName} collectionida documentlar topilmadi.`
            )
            // Resolve with success response indicating nothing was updated
            resolve(
              success.call(
                this,
                `${JSON.stringify(docSelectionCriteria)} dagi "${collectionName}" collectionida 0 document yangilandi.`,
                docUpdates
              )
            )
            return
          }
          if (docsToUpdate.length > 1) {
            logger.warn.call(
              this,
              `${JSON.stringify(docSelectionCriteria)} bilan yangilash uchun (${docsToUpdate.length}) ta document(lar) topildi.`
            )
          }
        })
        .then(() => {
          if (!docsToUpdate.length) return // Skip if nothing to update

          docsToUpdate.forEach((docToUpdate, index) => {
            this.lf[collectionName]
              .setItem(docToUpdate.key, docToUpdate.newDocument)
              .then(_value => {
                if (index === docsToUpdate.length - 1) {
                  resolve(
                    success.call(
                      this,
                      `${JSON.stringify(docSelectionCriteria)} dagi "${collectionName}" collectionida ${docsToUpdate.length} document${docsToUpdate.length > 1 ? 'lar' : ''} yangilandi.`,
                      docUpdates
                    )
                  )
                }
              })
              .catch(_err => {
                reject(
                  error.call(
                    this,
                    `${collectionName} collectionidagi ${docsToUpdate.length} ta document yangilanmadi.`
                  )
                )
              })
          })
        })
    }

    // update document by key
    this.updateDocumentByKey = () => {
      let newDocument = {}
      this.lf[collectionName]
        .getItem(docSelectionCriteria)
        .then(_value => {
          newDocument = updateObject(value, docUpdates)
          this.lf[collectionName].setItem(docSelectionCriteria, newDocument)
          resolve(
            success.call(
              this,
              `"${collectionName}" collectionidagi document ${JSON.stringify(docSelectionCriteria)} kaliti bilan yangilandi.`,
              newDocument
            )
          )
        })
        .catch(_err => {
          reject(
            error.call(
              this,
              `"${collectionName}" collectionida ${JSON.stringify(docSelectionCriteria)} kalitli document topilmadi.`
            )
          )
        })
    }

    // check for user errors
    if (!docUpdates) {
      this.userErrors.push(
        'Update() methodi uchun yangilanish objecti taqdim etilmagan. Objectdan foydalaning. Masalan: {ism: "Otabek"}.'
      )
    } else if (!(typeof docUpdates == 'object' && docUpdates instanceof Array == false)) {
      this.userErrors.push(
        "Update() ga uzatilgan ma'lumotlar object bo'lishi kerak. Array, string, number yoki boolean emas."
      )
    }

    if (!this.userErrors.length) {
      if (typeof docSelectionCriteria == 'object') {
        this.updateDocumentByCriteria()
      } else {
        this.updateDocumentByKey()
      }
    } else {
      showUserErrors.call(this)
    }
  })
}
