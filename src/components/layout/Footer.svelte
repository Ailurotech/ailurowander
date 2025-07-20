<script lang="ts">
  import { t } from '$lib/i18n';
</script>

<footer class="bg-primary text-white py-10">
  <div class="container">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <div class="flex items-center space-x-2 mb-4">
          <img src="/ailuro-logo.png" alt="AiluroWander" class="h-8 w-auto" />
          <h3 class="text-xl font-bold">AiluroWander</h3>
        </div>
        <p class="text-gray-200 max-w-xs">{$t('footer.company_description')}</p>
      </div>

      <div>
        <h4 class="text-lg font-bold mb-4">{$t('footer.explore')}</h4>
        <ul class="space-y-2">
          <li><a href="/tours" class="text-gray-200 hover:text-white">{$t('nav.tours')}</a></li>
          <li>
            <a href="/destinations" class="text-gray-200 hover:text-white"
              >{$t('footer.destinations')}</a
            >
          </li>
          <li>
            <a href="/experiences" class="text-gray-200 hover:text-white"
              >{$t('footer.experiences')}</a
            >
          </li>
        </ul>
      </div>

      <div>
        <h4 class="text-lg font-bold mb-4">{$t('footer.company')}</h4>
        <ul class="space-y-2">
          <li>
            <a href="/about" class="text-gray-200 hover:text-white">{$t('footer.about_us')}</a>
          </li>
          <li><a href="/contact" class="text-gray-200 hover:text-white">{$t('nav.contact')}</a></li>
          <li><a href="/terms" class="text-gray-200 hover:text-white">{$t('footer.terms')}</a></li>
        </ul>
      </div>

      <div>
        <h4 class="text-lg font-bold mb-4">{$t('footer.connect')}</h4>
        <div class="flex space-x-4">
          <a
            href="https://twitter.com/ailuroWander"
            class="text-gray-200 hover:text-white p-2 rounded-full hover:bg-white/10"
            aria-label="Twitter"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              class="fill-current"
            >
              <path
                d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"
              ></path>
            </svg>
          </a>
          <a
            href="https://youtube.com/ailuroWander"
            class="text-gray-200 hover:text-white p-2 rounded-full hover:bg-white/10"
            aria-label="YouTube"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              class="fill-current"
            >
              <path
                d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"
              ></path>
            </svg>
          </a>
          <a
            href="https://facebook.com/ailuroWander"
            class="text-gray-200 hover:text-white p-2 rounded-full hover:bg-white/10"
            aria-label="Facebook"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              class="fill-current"
            >
              <path
                d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"
              ></path>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>
</footer>

<div class="bg-primary-dark text-white py-4">
  <div class="container text-center">
    <p>&copy; {new Date().getFullYear()} AiluroWander. {$t('footer.rights')}</p>
  </div>
</div>
