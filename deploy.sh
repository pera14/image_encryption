git add .; git commit -a -m 'Deploy'; git push;
curl -X POST -d {} https://api.netlify.com/build_hooks/5ffc717a0cc6c323ac338e90