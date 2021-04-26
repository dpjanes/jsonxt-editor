/**
 *  lib/cli/editor.link.js
 *
 *  David Janes
 *  Concordance
 *  2020-09-24
 */

"use strict"

const _ = require("iotdb-helpers")
const inquirer = require("inquirer")
const fuzzy = require("fuzzy")

const _util = require("./_util")

/**
 */
const link = _.promise((self, done) => {
    const editor = require("../..")

    const choices = self.items
        .map(item => _util.name(item))
        .filter(name => name)
    choices.unshift("-")

    const _search = (answers, input) => new Promise(resolve => {
        resolve(
            fuzzy.filter(_.coerce.string.unnulled(input), choices)
            .map(choice => choice.original)
        )
    })

    if (self.in) {
        const name = _util.name(self.in)
        if (choices.indexOf(name) > -1) {
            _.pull(choices, name)
            choices.unshift(name)
        }
    }

    let selectedIndex = 0
    if (self.in) {
        selectedIndex = Math.min(0, choices.indexOf(_util.name(self.in)))
    }

    inquirer
        .prompt([
            {
                type: "autocomplete",
                name: "value",
                suffix: ":",
                prefix: "-",
                message: self.prompt,
                source: _search,
            },
        ])
        .then(result => {
            self.out = null

            const item = self.items.find(item => _util.name(item) === result.value)
            if (item) {
                self.out = {
                    "@id": _util.id(item),
                    "@type": _util.type(item),
                    "schema:name": _util.name(item),
                }
            }

            done(null, self)
        })
        .catch(x => {
            x.self = self
            done(x)
        })
})

link.method = "lib.cli.editor.link"
link.description = ``
link.requires = {
    items: _.is.Array,
    prompt: _.is.String,
    in: [ _.is.Dictionary, _.is.Null ],
    out: _.is.Null,
    required: _.is.Boolean,
}
link.accepts = {
}
link.produces = {
    out: _.is.Dictionary,
}

/**
 *  API
 */
exports.link = link
