import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const SecondPage = () => (
  <Layout>
    <SEO title="My Page" />
    <h1>Hello There</h1>
    <p>Something</p>
    <Link to="/">Go back to the homepage</Link>
  </Layout>
)

export default SecondPage
