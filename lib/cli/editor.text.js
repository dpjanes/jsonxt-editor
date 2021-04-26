/**
 *  lib/cli/editor.text.js
 *
 *  David Janes
 *  Concordance
 *  2020-09-24
 */

"use strict"

const _ = require("iotdb-helpers")
const inquirer = require("inquirer")

/**
 */
const text = _.promise((self, done) => {
    const concordance = require("../..")
    
    inquirer
        .prompt([
            {
                type: "input",
                name: "value",
                message: self.prompt,
                suffix: ":",
                prefix: "-",
                default: _.coerce.string.nulled(self.in),
            },
        ])
        .then(result => {
            self.out = _.coerce.string.nulled(result.value.trim())

            done(null, self)
        })
        .catch(x => {
            x.self = self
            done(x)
        })
})

text.method = "lib.cli.editor.text"
text.description = ``
text.requires = {
    prompt: _.is.String,
    in: [ _.is.String, _.is.Null ],
    out: _.is.Null,
    required: _.is.Boolean,
}
text.accepts = {
}
text.produces = {
    out: _.is.String,
}

/**
 *  API
 */
exports.text = text
