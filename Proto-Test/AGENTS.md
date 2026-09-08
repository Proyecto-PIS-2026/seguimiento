# Proto-Test

- Do not commit changes unless the user explicitly replaces their no-commit instruction.
- Keep changes inside `Proto-Test` and do not modify `proto-ui`.
- Use TypeScript for application code; keep each component in its own file.
- Reuse shared components instead of adding duplicate listing formats.
- Preserve the four original listing formats and catalog relationships documented in `../proto-ui/AGENTS.md`.
- Catalog forms use Especie, Variedad, Presentación, Unidad de medida, Calibre, Categoría, and combinación comercial.
- Domain helpers in `src/shared.ts` and `src/shared/catalog/groupActorProducts.ts` intentionally match the original prototype.
- Give feedback after each iteration and list pending tasks before starting new work.
