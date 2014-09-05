## Overview

This web-component introduces a custom element `x-reference` that retrieves and displays a fragment of
a specified external resource matching given grep condition or selector

## Install

Install the component using [Bower](http://bower.io/):

```sh
$ bower install dsheiko/x-reference --save
```

Or [download as ZIP](https://github.com/dsheiko/x-reference).

## Usage

1. Import Web Components' polyfill:

    ```html
    <script src="bower_components/platform/platform.js"></script>
    ```

2. Import Custom Element:

    ```html
    <link rel="import" href="../src/x-reference.html">
    ```

3. Start using it!

    You can extract a fragment by CSS selector:
    ```html
    <x-reference href="url-address" locator="a-CSS-selector">
        Text content
    </x-reference>
    ```
    or you can use a regexp condition:
    ```html
    <x-reference href="url-address" grep="reg-exp">
        Text content
    </x-reference>
    ```


## Methods

Method        | Parameters   | Returns     | Description
---           | ---          | ---         | ---
`openModal`   | None         | void        | Implicit request for showing the fragment.

## Events

Event         | Description
---           | ---
`click`       | Retrieve and show a modal with fragment


## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D


## License

[MIT License](http://opensource.org/licenses/MIT)

