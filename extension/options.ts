var browser: Browser = browser || chrome;

browser.storage.local.get(['theme'], obj => {

    var theme: string = obj.theme || 'default';
    var themeSettingsContainer = document.getElementById('theme-settings');

    [
        'default',
        'amber-max',
    ].map(x => {
        themeSettingsContainer.insertAdjacentHTML('beforeend', `
        <label class="jeffrey-associates-theme jeffrey-associates-theme-${x}">
        <input type="radio" name="selected-theme" ${x == theme ? 'checked' : ''} data-theme="${x}">
        <span class="assigned-label-associate">Epstein Associate</span>,
        <span class="assigned-label-unknown" title="No label applied">Unknown</span>
        </label>
        `);
    });

});

document.getElementById('save-button').addEventListener('click', async () => {
    var theme = (<HTMLInputElement>
        [...document.querySelectorAll('.jeffrey-associates-theme input')]
            .filter(x => (<HTMLInputElement>x).checked)[0]
    ).dataset.theme;
    browser.runtime.sendMessage(<JeffreyAssociatesCommand>{ closeCallingTab: true, setTheme: theme }, () => { });
});


document.getElementById('cancel-button').addEventListener('click', async () => {
    browser.runtime.sendMessage(<JeffreyAssociatesCommand>{ closeCallingTab: true }, () => { });
});
