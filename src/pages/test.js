import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
var moment = require('moment');


const interest = 0.03
const years = 15;

export const query = graphql`
query {
  principal: allAirtable(filter: {table: {eq: "Monthly NW"}}, sort: {fields: data___NetWorth, order: DESC}, limit: 1) {
    edges {
      node {
        data {
          principal: NetWorth
          date: Date
        }
      }
    }
  }
  targets: allAirtable(filter: {table: {eq: "Expenses"}}) {
    edges {
      node {
        data {
          targetIncome: Gross_Yearly
          level: Level
        }
      }
    }
  }
  incomes: allAirtable(filter: {table: {eq: "Income"}}) {
    edges {
      node {
        data {
          income: Avg_Income
          level: Level
        }
      }
    }
  }
}
`

function interestEarned(principal, interest) {
  console.log("p", principal, "interest", interest)
  return Math.round(principal * Math.pow(1 + (interest/12), 1))
}

function generateTimeFrame(initialDate) {
  // const date = new Date("2020-01-23");
  var dates = []
  for (var i = 0; i < years * 12; i++) {
    var d = moment(initialDate)
    var now_formatted = ""
    var now = d.add(i, 'months')
    now_formatted =  now.format("YYYY")

    dates.push({
      // name: now_formatted
      name: 27 + (i / 12)
    })
  }
  return dates
}

export default ({ data }) => {

  const principal = data.principal.edges[0].node.data.principal
  const initialDate = data.principal.edges[0].node.data.date
  var dates = generateTimeFrame(initialDate)
  // set targets
  data.targets.edges.forEach(node => {
    const d = node.node.data
    dates = dates.map((x) => {
      var tmp = {}
      tmp[`target_${d.level}`] = d.targetIncome / 0.04
      return {...x, ...tmp}
    })
  })

  data.incomes.edges.forEach(node => {
    const d = node.node.data;

    dates = dates.reduce((acc, curr, idx) => {
      const key = `projected_${d.level}`
      const p = idx === 0 ? principal : acc[acc.length-1][key]
      // console.log("acc", acc)
      // console.log("curr", curr)
      var tmp = {}
      tmp[key] = interestEarned(p + d.income / 12, interest)
      acc.push({...curr, ...tmp})
      return acc
    }, [])
    // dates = dates.map((x, i, arr) => {
    //   const key = `projected_${d.level}`
    //   const p = i === 0 ? principal : arr[i-1][key]
    //   let income = interestEarned(p + d.income / 12, interest)
    //   var tmp = {}
    //   tmp[key] = income
    //   return {...x, ...tmp}
    // })
  })

  console.log(data.incomes.edges[0].node.data)

  // reduce granularity further into the future
  dates = dates.filter((x, i) => {
    return i % 12 === 0
    // return i < 24 || i % 12 === 0
  })

  console.log(dates)

  return <Layout>
    <LineChart width={1024} height={300} data={dates}>
    <XAxis dataKey="name" />
    <YAxis />
    <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
    <Line type="monotone" dataKey="target_low" stroke="#82ca9d" />
    <Line type="monotone" dataKey="target_medium" stroke="#dddd00" />
    <Line type="monotone" dataKey="target_high" stroke="#dd0000" />

    <Line type="monotone" dataKey="projected_low" stroke="#82ca9d" />
    <Line type="monotone" dataKey="projected_medium" stroke="#dddd00" />
    <Line type="monotone" dataKey="projected_high" stroke="#dd0000" />
    </LineChart>
    </Layout>
}
