---
title: Home
layout: home

hero:
  name: Ez Form
  text: Modern Vue Form.
  tagline: Powerful, Easy-to-use form package.
  image:
    src: /logo.png
    alt: Ez Form
  actions:
    - theme: brand
      text: Get Started
      link: /guide/why-ez-form
    - theme: alt
      text: View on GitHub
      link: https://github.com/niku98/ez-form

features:
  - icon: ⚡️
    title: Fast and Easy to use.
    details: Fast and easy to build your form.
  - icon: 🖖
    title: Validation
    details: Validate your form very easy with Async validator.
  - icon: 🛠️
    title: Simple and minimal.
    details: Starting build your form with no configuration.
---

<script setup>
import { VPTeamMembers } from 'vitepress/theme'

const members = [
  {
    avatar: 'https://www.github.com/niku98.png',
    name: 'Niku',
    title: 'Creator',
    links: [
      { icon: 'github', link: 'https://github.com/niku98' },
    ]
  },
]
</script>
<style>
  h2.author-title {
    font-size: 2rem;
    margin: 2rem 0;
    margin-top: 10rem;
  }
</style>

<center>
<h2 class="author-title">
Author
</h2>
</center>

<VPTeamMembers size="small" :members="members" />
