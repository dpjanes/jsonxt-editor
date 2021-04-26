/**
 *  lib/cli/editor.datetime.js
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
const datetime = _.promise((self, done) => {
    inquirer
        .prompt([
            {
                type: "datetime",
                name: "value",
                message: self.prompt,
                suffix: ":",
                prefix: "-",
                format: [ "yyyy", "-", "dd", "-", "mm", " ", "h", ":", "MM", " ", "TT" ],
                initial: self.in ? new Date(self.in) : new Date("0001-01-01"),
            },
        ])
        .then(result => {
            if (result.value.getFullYear() === 1) {
                self.out = null
            } else {
                self.out = result.value.toISOString()
            }

            done(null, self)
        })
        .catch(x => {
            x.self = self
            done(x)
        })
})

datetime.method = "lib.cli.editor.datetime"
datetime.description = ``
datetime.requires = {
    prompt: _.is.String,
    in: [ _.is.String, _.is.Null ],
    out: _.is.Null,
    required: _.is.Boolean,
}
datetime.accepts = {
}
datetime.produces = {
    out: _.is.String,
}

/**
 *  API
 */
exports.datetime = datetime
