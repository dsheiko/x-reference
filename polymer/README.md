## Overview

This web-component introduces a custom element `x-reference` that retrieves and displays a fragment of
a specified external resource matching given grep condition or selector

## Usage

You can extract a fragment by CSS selector:

<x-reference href="url-address" locator="a-CSS-selector">
    Text content
</x-reference>


or you can use a regexp condition:

<x-reference href="url-address" grep="reg-exp">
    Text content
</x-reference>


# Methods

## ___openModal___

Implicit request for showing the fragment


# Events

## ___click___

Retrieve and show a modal with fragment


# Create X-Tag Components

[Guide for creating X-Tag Components](https://github.com/x-tag/core/wiki/Creating-X-Tag-Components)

# Use X-Tag Components

[Using X-Tag components in your applications](https://github.com/x-tag/core/wiki/Using-X-Tag-Components-in-your-application)

