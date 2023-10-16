RELEASE_VERSION = v0.0.7-beta
IMAGE_NAME=ghcr.io/sunbird-rc/sunbird-rc-admin-portal
build:
	docker build -t $(IMAGE_NAME) .

release: build
	docker tag $(IMAGE_NAME) $(IMAGE_NAME):$(RELEASE_VERSION)
	docker push $(IMAGE_NAME):latest
	docker push $(IMAGE_NAME):$(RELEASE_VERSION)
