<?php

namespace App\Services;

use Symfony\Component\HtmlSanitizer\HtmlSanitizer;
use Symfony\Component\HtmlSanitizer\HtmlSanitizerConfig;

class HtmlSanitizerService
{
    protected ?HtmlSanitizer $sanitizer = null;

    /**
     * Get or build the HtmlSanitizer instance configured with a strict allowlist.
     */
    public function getSanitizer(): HtmlSanitizer
    {
        if ($this->sanitizer === null) {
            $config = (new HtmlSanitizerConfig())
                ->allowSafeElements()
                ->allowRelativeLinks(true)
                ->allowRelativeMedias(true)
                ->withMaxInputLength(5_000_000)
                ->allowElement('p', ['class'])
                ->allowElement('span', ['class'])
                ->allowElement('h1', ['class', 'id'])
                ->allowElement('h2', ['class', 'id'])
                ->allowElement('h3', ['class', 'id'])
                ->allowElement('h4', ['class', 'id'])
                ->allowElement('h5', ['class', 'id'])
                ->allowElement('h6', ['class', 'id'])
                ->allowElement('strong')
                ->allowElement('b')
                ->allowElement('em')
                ->allowElement('i')
                ->allowElement('u')
                ->allowElement('s')
                ->allowElement('strike')
                ->allowElement('sub')
                ->allowElement('sup')
                ->allowElement('ul', ['class'])
                ->allowElement('ol', ['class', 'start'])
                ->allowElement('li', ['class', 'value'])
                ->allowElement('blockquote', ['class'])
                ->allowElement('pre', ['class'])
                ->allowElement('code', ['class'])
                ->allowElement('a', ['href', 'title', 'target', 'rel', 'class'])
                ->allowElement('img', ['src', 'alt', 'title', 'width', 'height', 'class', 'loading'])
                ->allowElement('table', ['class', 'border'])
                ->allowElement('thead', ['class'])
                ->allowElement('tbody', ['class'])
                ->allowElement('tr', ['class'])
                ->allowElement('th', ['class', 'colspan', 'rowspan', 'scope'])
                ->allowElement('td', ['class', 'colspan', 'rowspan'])
                ->allowElement('div', ['class'])
                ->allowElement('br')
                ->allowElement('hr');

            $this->sanitizer = new HtmlSanitizer($config);
        }

        return $this->sanitizer;
    }

    /**
     * Sanitize untrusted HTML input against XSS vectors using strict allowlist.
     */
    public function sanitize(?string $html): string
    {
        if ($html === null || trim($html) === '') {
            return '';
        }

        return $this->getSanitizer()->sanitize($html);
    }
}
