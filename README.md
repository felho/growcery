## Issues

### Small todos

- [x] Rename files: topnav to top-nav, syncuser to sync-user

### Small improvement ideas

- [ ] Check the clsx package, it could simplify writing className related logic
- [ ] Check whether a useHasInteracted() hook is better solution then the useHasInteracted() parameter
- [ ] Check this idea: in the case a component has more paramters, defaultProps pattern or NextJS's withDefaults helper could be better.

### Login / user management

- [ ] Saving user is not perfect now, it is possible that a user is created already, but not yet logged in, so we need to first check whether a user with the email address exists or not.
- [ ] User has to be added to the default organization until multiple ones are supported
- [ ] We need to work out how a user is connected to an organization

### Thing I was not able to do, so needs to be fixed later

- [ ] The slade-in animation in the case of Sidebar through className.
- [ ] The fade-in animation in admin/page.tsx.
- [ ] Uninstall tailwindcss-animate and remove it from tailwind config. (I have it now only for debug purposes.)

## Decisions for feedback

- [ ] I wanted to ensure in one place that if a user is not signed in, then they can't reach other parts of the app except the home page. I tried to do this with in the middleware.ts, but redirecting there resulted in error. Then I tried to do it in the layout, but it turned out that it not sure that a request is chained through the layout (like a middleware), so I dropped that idea. Finally, I managed to do it in the layout with the SignedIn and SingnedOut providers provided by Clerk.
- [ ] I was not able to call "await syncUserToDb()" inside the TSX in the layout. Moving before the return statement wouldn't work, as I wanted to rely on the SignedIn provider. This is why I decided to move it to the `<SyncUser />` component.
- [ ] Originally T3 stack created a JS tailwind config, I changed that to TS.
- [ ] I used originally not fully consciously the "dark" mode. It is applied through class on the body tag. The design I am building is dark, and the light version is not designed. So for now, I add all the color definitions to both the `:root` and `.dark` in the global.css. I assume, this way it will be easy to see which colors have to be adjusted to create a light version.
- [ ] Adding shadcn to the app was a bit painful, as it overwrites some of the colors I already used in the app. Currently, I decided, that the way I approach this is commenting out those parts of the CSS installed by shadcn which I defined already.
- [ ] I was not able to figure out why text-primary is white here: `<h1 className="text-primary text-xl font-semibold text-[hsl(122,50%,45%)]">`, so I decided to temporarily set the color explicetly.
- [ ] When I implemented the sidebar toggle functionality, I needed to use useState. But it can only be used in a client component, so I was not able to use it in the top layout. So I needed to move `<TopNav />` to the `<MainLayout />`. This component is needed on the Sign In state as well, so I also needed to add to `<SignInLayout />` as well.
- [ ] In the original design the `<Sidebar />` toggle was implemented through `className`: `animate-slide-in`, and the related configuration was in Tailwind config. It didn't work for me at that point. It would be interesting to figure out how this can work that way.
- [ ] I had another issue with Tailwind animation. It didn't work automatically. It would be important to figure out why it didn't work.
