library(yaml)
x <- yaml.load(readLines("chapter.yaml"))
length(x)
items <- x$items
count <- length(items)

titles <- vector(mode="character", length=count)
lats <- vector(mode="numeric", length=count)
lons <- vector(mode="numeric", length=count)
descriptions <- vector(mode="character", length=count)
medias <- vector(mode="character", length=count)

for(i in seq_len(count)){
   item <- items[[i]]
   titles[i] <- sprintf('"%s"', item$title)
   lats[i] <- item$lat
   lons[i] <- item$lon
   descriptions[i] <- sprintf('"%s"', item$description)
   medias[i] <- item$media
   }
tbl <- data.frame(Latitude=lats, Longitude=lons, Chapter=titles,
                  Description=descriptions, 'media'=medias)
colnames(tbl)[5] <- "Media Link"
write.table(tbl, file="Chapters.csv", sep=",", quote=FALSE, row.names=FALSE)
