/**
 *  lib/util.js
 *
 *  David Janes
 *  Concordance
 *  2020-09-23
 */

"use strict"

const _ = require("iotdb-helpers")

/**
 */
const extract = (d, key) => {
    let maybe = null

    const candidates = _.d.list(d, key, [])
    for (let ci = 0; ci < candidates.length; ci++) {
        const s = candidates[ci]
        if (_.is.Nullish(s)) {
            continue
        } else if (_.is.Atomic(s)) {
            maybe = s
        } else if (s["@value"]) {
            maybe = s["@value"]
            if (s["@language"] === "en") {
                break
            }
        }
    }

    return maybe
}

/**
 */
const list = (d, key) => _.d.list(d, key, [])

/**
 */
const capwords = s => 
    _.id.to_parts(s, true)
        .map(part => part.substring(0, 1).toUpperCase() + part.substring(1))
        .join(" ");

const assume = (s, prefix) => {
    if (s.indexOf(":") > -1) {
        return s
    } else {
        return `${prefix || "schema:"}${s}`
    }
}

const link_first = (d, property) => _.d.first(_.d.first(d, property, {}), "@id", null)

/**
 *  API
 */
exports.extract = extract
exports.list = list
exports.capwords = capwords
exports.assume = assume

exports.id = d => extract(d, "@id")
exports.graph = d => _.d.list(d, "@graph", null)
exports.type = d => extract(d, "@type")
exports.name = d => extract(d, "schema:name") || extract(d, "rdfs:label")

exports.link = {
    first: link_first,
}
