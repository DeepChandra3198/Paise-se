var DateTime = luxon.DateTime;

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

function starString(str) {
  if (str.length < 3) {
    return str;
  }

  var result = str[0] + '*'.repeat(str.length - 2) + str[str.length - 1];
  return result;
}

function handleMessage(icon, title, message) {
  if (message) {
    Toast.fire({
      icon,
      title,
      text: message,
    });
    return true;
  }
  return false;
}

function handleDelete(event) {
  const url = event.dataset.url;
  Swal.fire({
    title: 'Do you want to delete this?',
    icon: 'question',
    showDenyButton: true,
    showCancelButton: true,
    denyButtonText: `Delete!`,
    showConfirmButton: false,
  }).then(async (result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isDenied) {
      handleMessage('success', 'Success!', 'Resource deleted successfully!');
      try {
        await axios.delete(url);
        setTimeout(() => {
          location.reload();
        }, 1000);
      } catch (error) {
        if (error.hasOwnProperty('response')) {
          return handleMessage('error', 'Something went wrong', error.response.data.message);
        } else {
          return handleMessage('error', 'Something went wrong', error.message);
        }
      }
    }
  });
}
if (document.querySelector('.desc') !== undefined && document.querySelector('.desc') !== null) {
  CKEDITOR.ClassicEditor.create(document.querySelector('.desc'), {
    // https://ckeditor.com/docs/ckeditor5/latest/features/toolbar/toolbar.html#extended-toolbar-configuration-format
    toolbar: {
      items: [
        'exportPDF',
        'exportWord',
        '|',
        'findAndReplace',
        'selectAll',
        '|',
        'heading',
        '|',
        'bold',
        'italic',
        'strikethrough',
        'underline',
        'code',
        'subscript',
        'superscript',
        'removeFormat',
        '|',
        'bulletedList',
        'numberedList',
        'todoList',
        '|',
        'outdent',
        'indent',
        '|',
        'undo',
        'redo',
        '-',
        'fontSize',
        'fontFamily',
        'fontColor',
        'fontBackgroundColor',
        'highlight',
        '|',
        'alignment',
        '|',
        'link',
        'insertImage',
        'blockQuote',
        'insertTable',
        'mediaEmbed',
        'codeBlock',
        'htmlEmbed',
        '|',
        'specialCharacters',
        'horizontalLine',
        'pageBreak',
        '|',
        'textPartLanguage',
        '|',
        'sourceEditing',
      ],
      shouldNotGroupWhenFull: true,
    },
    // Changing the language of the interface requires loading the language file using the <script> tag.
    // language: 'es',
    list: {
      properties: {
        styles: true,
        startIndex: true,
        reversed: true,
      },
    },
    // https://ckeditor.com/docs/ckeditor5/latest/features/headings.html#configuration
    heading: {
      options: [
        {
          model: 'paragraph',
          title: 'Paragraph',
          class: 'ck-heading_paragraph',
        },
        {
          model: 'heading1',
          view: 'h1',
          title: 'Heading 1',
          class: 'ck-heading_heading1',
        },
        {
          model: 'heading2',
          view: 'h2',
          title: 'Heading 2',
          class: 'ck-heading_heading2',
        },
        {
          model: 'heading3',
          view: 'h3',
          title: 'Heading 3',
          class: 'ck-heading_heading3',
        },
        {
          model: 'heading4',
          view: 'h4',
          title: 'Heading 4',
          class: 'ck-heading_heading4',
        },
        {
          model: 'heading5',
          view: 'h5',
          title: 'Heading 5',
          class: 'ck-heading_heading5',
        },
        {
          model: 'heading6',
          view: 'h6',
          title: 'Heading 6',
          class: 'ck-heading_heading6',
        },
      ],
    },
    // https://ckeditor.com/docs/ckeditor5/latest/features/editor-placeholder.html#using-the-editor-configuration
    placeholder: 'Enter',
    // https://ckeditor.com/docs/ckeditor5/latest/features/font.html#configuring-the-font-family-feature
    fontFamily: {
      options: [
        'default',
        'Arial, Helvetica, sans-serif',
        'Courier New, Courier, monospace',
        'Georgia, serif',
        'Lucida Sans Unicode, Lucida Grande, sans-serif',
        'Tahoma, Geneva, sans-serif',
        'Times New Roman, Times, serif',
        'Trebuchet MS, Helvetica, sans-serif',
        'Verdana, Geneva, sans-serif',
      ],
      supportAllValues: true,
    },
    // https://ckeditor.com/docs/ckeditor5/latest/features/font.html#configuring-the-font-size-feature
    fontSize: {
      options: [10, 12, 14, 'default', 18, 20, 22],
      supportAllValues: true,
    },
    // Be careful with the setting below. It instructs CKEditor to accept ALL HTML markup.
    // https://ckeditor.com/docs/ckeditor5/latest/features/general-html-support.html#enabling-all-html-features
    htmlSupport: {
      allow: [
        {
          name: /.*/,
          attributes: true,
          classes: true,
          styles: true,
        },
      ],
    },
    // Be careful with enabling previews
    // https://ckeditor.com/docs/ckeditor5/latest/features/html-embed.html#content-previews
    htmlEmbed: {
      showPreviews: true,
    },
    // https://ckeditor.com/docs/ckeditor5/latest/features/link.html#custom-link-attributes-decorators
    link: {
      decorators: {
        addTargetToExternalLinks: true,
        defaultProtocol: 'https://',
        toggleDownloadable: {
          mode: 'manual',
          label: 'Downloadable',
          attributes: {
            download: 'file',
          },
        },
      },
    },
    // https://ckeditor.com/docs/ckeditor5/latest/features/mentions.html#configuration
    mention: {
      feeds: [
        {
          marker: '@',
          feed: [
            '@apple',
            '@bears',
            '@brownie',
            '@cake',
            '@cake',
            '@candy',
            '@canes',
            '@chocolate',
            '@cookie',
            '@cotton',
            '@cream',
            '@cupcake',
            '@danish',
            '@donut',
            '@dragée',
            '@fruitcake',
            '@gingerbread',
            '@gummi',
            '@ice',
            '@jelly-o',
            '@liquorice',
            '@macaroon',
            '@marzipan',
            '@oat',
            '@pie',
            '@plum',
            '@pudding',
            '@sesame',
            '@snaps',
            '@soufflé',
            '@sugar',
            '@sweet',
            '@topping',
            '@wafer',
          ],
          minimumCharacters: 1,
        },
      ],
    },
    // The "super-build" contains more premium features that require additional configuration, disable them below.
    // Do not turn them on unless you read the documentation and know how to configure them and setup the editor.
    removePlugins: [
      // These two are commercial, but you can try them out without registering to a trial.
      // 'ExportPdf',
      // 'ExportWord',
      'CKBox',
      'CKFinder',
      'EasyImage',
      // This sample uses the Base64UploadAdapter to handle image uploads as it requires no configuration.
      // https://ckeditor.com/docs/ckeditor5/latest/features/images/image-upload/base64-upload-adapter.html
      // Storing images as Base64 is usually a very bad idea.
      // Replace it on production website with other solutions:
      // https://ckeditor.com/docs/ckeditor5/latest/features/images/image-upload/image-upload.html
      // 'Base64UploadAdapter',
      'RealTimeCollaborativeComments',
      'RealTimeCollaborativeTrackChanges',
      'RealTimeCollaborativeRevisionHistory',
      'PresenceList',
      'Comments',
      'TrackChanges',
      'TrackChangesData',
      'RevisionHistory',
      'Pagination',
      'WProofreader',
      // Careful, with the Mathtype plugin CKEditor will not load when loading this sample
      // from a local file system (file://) - load this site via HTTP server if you enable MathType
      'MathType',
    ],
  });
}

if (
  document.querySelector('.format-date') !== undefined &&
  document.querySelector('.format-date') !== null
) {
  document.querySelectorAll('.format-date').forEach((date) => {
    date.textContent = DateTime.fromJSDate(new Date(date.textContent.trim())).toFormat('ff');
  });
}

$(document).ready(function () {
  if (
    document.querySelector('.select2-select') !== undefined &&
    document.querySelector('.select2-select') !== null
  ) {
    $('.select2-select').select2({
      width: '100%',
      allowClear: true,
      placeholder: 'Select',
    });
  }
});

if (
  document.querySelector('.compare-cards-form') !== undefined &&
  document.querySelector('.compare-cards-form') !== null
) {
  document.querySelector('.compare-cards-form').addEventListener('submit', (event) => {
    let checkedCardsCount = 0;
    event.preventDefault();
    document.querySelectorAll('.cards-compare-checkbox').forEach((checkbox) => {
      if (checkbox.checked) {
        ++checkedCardsCount;
      }
    });
    if (checkedCardsCount > 0 && checkedCardsCount <= 3) {
      event.target.submit();
    }
    if (checkedCardsCount === 0) {
      handleMessage('warning', 'Warning', 'Please select atleast one card to compare');
    }
    if (checkedCardsCount > 3) {
      handleMessage('warning', 'Warning', 'You can select upto 3 cards at once');
    }
  });

  document.querySelectorAll('.card-detail-btn').forEach((btns) => {
    btns.addEventListener('click', (btn) => {
      btn.target.parentElement.parentElement.parentElement.parentElement.parentElement.nextElementSibling.classList.toggle(
        'd-none'
      );
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (
    document.querySelector(`input[name="dob"]`) !== null &&
    document.querySelector(`input[name="dob"]`) !== undefined
  ) {
    const date = $('input[name="dob"]').val();

    $('input[name="dob"]').daterangepicker({
      autoApply: true,
      showApplyButton: false,
      singleDatePicker: true,
      showDropdowns: true,
      minDate: moment('1950-01-01', 'YYYY-MM-DD').add('days', 1),
      maxDate: moment(new Date()).format('YYYY-MM-DD'),
      startDate:
        date.length > 0 ? moment(date, 'YYYY-MM-DD') : moment(new Date()).format('YYYY-MM-DD'),
      locale: {
        format: 'YYYY-MM-DD',
      },
    });
  }

  if (
    document.querySelector(`.hide-pancard`) !== null &&
    document.querySelector(`.hide-pancard`) !== undefined
  ) {
    document.querySelector('.hide-pancard').value = starString(
      document.querySelector('.hide-pancard').value
    );
  }

  if (
    document.querySelector(`.navbar-area`) !== null &&
    document.querySelector(`.navbar-area`) !== undefined
  ) {
    document.addEventListener('click', function (event) {
      var target = event.target;
      if (document.querySelector(`.navbar-area`).classList.contains('open')) {
        if (!target.closest('.navbar-area .open')) {
          if (
            !target.classList.contains('meanmenu-reveal') &&
            target.tagName.toLowerCase() !== 'span'
          ) {
            document.querySelector(`.meanclose`).click();
          }
        }
      }
    });
  }
});
if (
  document.querySelector(`.export-btn`) !== null &&
  document.querySelector(`.export-btn`) !== undefined
) {
  document.querySelector('.export-btn').addEventListener('click', (event) => {
    const form = document.querySelector('.action-form');
    form.setAttribute('action', event.target.dataset.url);
    form.submit();
  });
}
if (
  document.querySelector(`.filter-btn`) !== null &&
  document.querySelector(`.filter-btn`) !== undefined
) {
  document.querySelector('.filter-btn').addEventListener('click', (event) => {
    const form = document.querySelector('.action-form');
    form.setAttribute('action', event.target.dataset.url);
    form.submit();
  });
}
