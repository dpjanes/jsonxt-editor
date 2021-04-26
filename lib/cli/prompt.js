/**
 *  lib/cli/prompt.js
 *
 *  David Janes
 *  Concordance
 *  2020-09-24
 */

"use strict"

const logger = require("../../logger")(__filename)
const _util = require("./_util")

const _ = require("iotdb-helpers")
const inquirer = require("inquirer")
const jsonxt = require("jsonxt")

let _once

/**
 */
const prompt = _.promise((self, done) => {
    const jsonxt_editor = require("../..")

    _.promise.validate(self, prompt)

    const p_id = _util.id(self.column)

    if (!_once) {
        _once = true
        inquirer.registerPrompt("datetime", require("inquirer-datepicker-prompt"))
        inquirer.registerPrompt("autocomplete", require("inquirer-autocomplete-prompt"))
    }
    
    _.promise(self)
        .make((sd, sdone) => {
            sd.in = null
            sd.out = null
            sd.required = false

            if (sd.column.name) {
                sd.prompt = sd.column.name
            } else if (sd.column.path) {
                sd.prompt = sd.column.path.replace(/^.*[.:]/, "")
            } else {
                sd.prompt = _util.name(sd.column)
            }

            sd.query = null

            let submodel = null
            let editor = null

            const schema = Object.assign({
                type: "string", 
            }, jsonxt.schemas[sd.column.encoder] || {}, sd.column.schema || {})
            
            switch (schema.type) {
            case "string":
                editor = jsonxt_editor.cli.editor.text || editor
                break
                
            case "date":
                editor = jsonxt_editor.cli.editor.date || editor
                break

            case "date-time":
                editor = jsonxt_editor.cli.editor.datetime || editor
                break

            case "integer":
                editor = jsonxt_editor.cli.editor.integer || editor
                break

            default:
                break
            }

            if (!editor) {
                logger.warn({
                    method: prompt.method,
                    column: sd.column,
                }, "hmmm - no editor")

                return sdone(null, sd)
            }

            const _doit = () => {
                sd.in = _.d.get(sd.item, sd.column.path, null)
                console.log("IN", sd.in, sd.column.path, sd.item)

                _.promise(sd)
                    .then(editor)
                    .make(sd => {
                        if (_.is.Null(sd.out)) {
                            if (sd.required) {
                                process.nextTick(_doit)
                                return
                            }
                        } else {
                            _.d.set(sd.item, sd.column.path, sd.out)
                        }

                        sdone(null, sd)
                    })
                    .catch(x => {
                        x.self = sd
                        sdone(x)
                    })
            }

            _doit()
        })

        .end(done, self, prompt)
})

prompt.method = "lib.cli.prompt"
prompt.description = ``
prompt.requires = {
    item: _.is.Dictionary,
    column: _.is.Dictionary,
}
prompt.accepts = {
}
prompt.produces = {
    item: _.is.Item,
}
prompt.params = {
    item: _.p.normal,
}
prompt.p = _.p(prompt)

/**
 *  API
 */
exports.prompt = prompt
