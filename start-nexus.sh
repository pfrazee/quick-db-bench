export NEXUS_BIND=":8080"
export NEXUS_COLLECTION_FILTERS="app.bsky.actor.profile,app.bsky.feed.post,app.bsky.feed.like,app.bsky.feed.repost,app.bsky.feed.threadgate,app.bsky.graph.follow"
cd ../indigo
go run ./cmd/nexus
