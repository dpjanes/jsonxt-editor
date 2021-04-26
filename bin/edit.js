/*
 *  index.js
 *
 *  David Janes
 *  IOTDB.org
 *  2021-04-25
 *
 *  Copyright (2013-2021) David P. Janes
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

"use strict"

const _ = require("iotdb-helpers")
const jsonxt_editor = require("..")

/**
 */
const edit_loop = _.promise((self, done) => {
    const _doit = () => {
        _.promise(self)
            .each({
                method: jsonxt_editor.cli.prompt,
                inputs: "template.columns:column",
            })
            .make(sd => {
                console.log("---")
                console.log(JSON.stringify(sd.item, null, 2))
                console.log("--")
            })
            .then(jsonxt_editor.cli.ask.p("OK?", [ "Save", "Cancel", "Edit" ]))
            .make(sd => {
                if (sd.answer === "Edit") {
                    process.nextTick(_doit)
                } else {
                    done(null, self)
                }
            })
            .catch(error => {
                done(error)
            })
    }

    _doit()
})

_.promise({
    template: require("../test/data/model.json"),
    item: {},
})
    .then(edit_loop)
    .catch(error => {
        console.log("#", _.error.message(error))
    })
