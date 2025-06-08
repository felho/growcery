## Issues

### Important features

- [ ] The reporting functionalities are not working for the QA comp matrix
- [ ] Check the manager group page: in the case of edit the already exisintg members should be at the top of the list.

### Small improvement ideas

- [ ] The API URLs are inconsistent (plural vs singular)
- [ ] The actionClient error handling has to be tested
- [ ] I like extend more in the zod file than the current merge
- [ ] On the function edit page, and probably elsewhere later, the icons should be aligned with the Action header
- [ ] Think about the naming of the zod schemas as currently the naming is a bit messy
- [ ] The user listing page has to be checked thorougly as this is a very naiv implementation
- [ ] The authorization has to be checked everywhere we query or change data
- [ ] In the user editing form later we need to filter the manager field to show only managers of the given function
- [ ] Archetype should be unique
- [ ] All the API calls have to be checked from an authorization perspective
- [ ] The organization of the client-api folder has to be revisited
- [ ] The API strucutre of the client APIs has to be revisited (for example comp-matrix.ts is probably not the best choice)
- [ ] comp-matrix-editor/page.tsx --> newMatrix state has no type
- [ ] Authentication is now sometimes in the database, sometimes in the action. This have to be revisited.
- [ ] There is a bug in the level editor: if I use Insert Before and then Cancel then the the main green button doesn't go back to the original Add New Level state
- [ ] Figure out why this doesn't work `import { reorderLevels } from "~/server/queries/comp-matrix-levels/reorder";`
- [ ] In the comp-matrix-levels/update.ts axtion if "/update" is removed from here: `import { updateLevel } from "~/server/queries/comp-matrix-levels/update";` then parsedInput indicates an error. Somehow this should be related to the previous issue.
- [ ] Need to rethink whether having a separate Insert and Update type is a good idea or not. The same applies for the zod schemas as well.
- [ ] The comp matrix level create.ts query seems odd, the input type doesn't match the type expected by the table.
- [ ] In the case of deleting a function the delete doesn't work if the function is already assigned to a user. Create a better errors message that explains why the delete failed in such a case.
- [ ] The same applies for users as well. Also, later think about whether we shouldn't delete a user but have an is active flag or something like that.
- [ ] IMPORTANT BUG: The reference ratings are loeded even in employee view.
- [ ] Turn off managing account option at Clerk
- [ ] Attribute ideas for the future: geo location, office vs remote, tenure, tech stack, employee vs contractor
- [ ] Use the level assessment component used on the calibration page for the comp matrix page as well (in calibration phase)
- [ ] Add org unit filter to the users admin
- [ ] Work out the detailed review cycle logic
- [ ] Ensure that all the relevant changes are logged in the database (this includes, that all the tables should have the same audit log related fields). Figure out whether it is possible to have one audit table which stores the changes of any of the changed fields.
- [ ] In the case of the user creation form, if no archetype is selected, then it leads to a foreign key constraint violation. In this case null should be passed to the server action.
- [ ] In the name selector combo box if I move to it with tab and then I can't get to an item by typing.

### Comp matrix

- [ ] The current HTML/CSS design is probably not bullet proof. It should be tested with different matrix sizes.

### Login / user management

- [ ] Saving user is not perfect now, it is possible that a user is created already, but not yet logged in, so we need to first check whether a user with the email address exists or not.
- [ ] User has to be added to the default organization until multiple ones are supported
- [ ] We need to work out how a user is connected to an organization

### Thing I was not able to do, so needs to be fixed later

- [ ] The slade-in animation in the case of Sidebar through className.
- [ ] The fade-in animation in admin/page.tsx.
- [ ] Uninstall tailwindcss-animate and remove it from tailwind config. (I have it now only for debug purposes.)
- [ ] Check pnpm audit --> Figure out how to manage updates properly.
- [ ] Check pnpm outdated --> Figure out how to manage updates properly.
- [ ] The breadcrumbs component is not yet flexible enough.

## Ideas for the future

- [ ] Check the clsx package, it could simplify writing className related logic
- [ ] Check whether a useHasInteracted() hook is better solution then the useHasInteracted() parameter
- [ ] Check this idea: in the case a component has more paramters, defaultProps pattern or NextJS's withDefaults helper could be better
- [ ] Adding fields to users: isActive, lastLogin

## Decisions for feedback

- [ ] I wanted to ensure in one place that if a user is not signed in, then they can't reach other parts of the app except the home page. I tried to do this with in the middleware.ts, but redirecting there resulted in error. Then I tried to do it in the layout, but it turned out that it not sure that a request is chained through the layout (like a middleware), so I dropped that idea. Finally, I managed to do it in the layout with the SignedIn and SingnedOut providers provided by Clerk.
- [ ] I was not able to call "await syncUserToDb()" inside the TSX in the layout. Moving before the return statement wouldn't work, as I wanted to rely on the SignedIn provider. This is why I decided to move it to the `<SyncUser />` component.
- [ ] Originally T3 stack created a JS tailwind config, I changed that to TS.
- [ ] I used originally not fully consciously the "dark" mode. It is applied through class on the body tag. The design I am building is dark, and the light version is not designed. So for now, I add all the color definitions to both the `:root` and `.dark` in the global.css. I assume, this way it will be easy to see which colors have to be adjusted to create a light version.
- [ ] When I implemented the sidebar toggle functionality, I needed to use useState. But it can only be used in a client component, so I was not able to use it in the top layout. So I needed to move `<TopNav />` to the `<MainLayout />`. This component is needed on the Sign In state as well, so I also needed to add to `<SignInLayout />` as well.
